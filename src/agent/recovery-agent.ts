import Anthropic from "@anthropic-ai/sdk";

import {
  getAvailableMethods,
  getCustomer,
  getIncident,
  getPayment,
  getPaymentHistory,
} from "@/agent/tools";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const tools: Anthropic.Tool[] = [
  {
    name: "get_incident",
    description: "Get a payment incident by incident ID.",
    input_schema: {
      type: "object",
      properties: {
        incidentId: {
          type: "string",
          description: "The incident identifier.",
        },
      },
      required: ["incidentId"],
    },
  },

  {
    name: "get_payment",
    description: "Get payment information by payment ID.",
    input_schema: {
      type: "object",
      properties: {
        paymentId: {
          type: "string",
          description: "The payment identifier.",
        },
      },
      required: ["paymentId"],
    },
  },

  {
    name: "get_customer",
    description: "Get customer information by customer ID.",
    input_schema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
          description: "The customer identifier.",
        },
      },
      required: ["customerId"],
    },
  },

  {
    name: "get_payment_history",
    description: "Get historical payments for a customer.",
    input_schema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
          description: "The customer identifier.",
        },
      },
      required: ["customerId"],
    },
  },

  {
    name: "get_available_methods",
    description:
      "Get available payment methods and whether they have historically been successful.",
    input_schema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
          description: "The customer identifier.",
        },
      },
      required: ["customerId"],
    },
  },

  {
    name: "submit_recovery_decision",
    description:
      "Submit the final recovery decision after gathering sufficient evidence.",
    input_schema: {
      type: "object",
      properties: {
        strategy: {
          type: "string",
          enum: [
            "RETRY_PAYMENT",
            "ALTERNATIVE_METHOD",
            "ESCALATE",
          ],
        },

        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },

        evidence: {
          type: "array",
          items: {
            type: "string",
          },
        },

        summary: {
          type: "string",
        },

        proposedAction: {
          type: "string",
          enum: [
            "CREATE_RECOVERY_LINK",
            "SUGGEST_ALTERNATIVE_METHOD",
            "HUMAN_REVIEW",
          ],
        },

        requiresApproval: {
          type: "boolean",
        },
      },

      required: [
        "strategy",
        "confidence",
        "evidence",
        "summary",
        "proposedAction",
        "requiresApproval",
      ],
    },
  },
];

async function executeTool(
  name: string,
  input: Record<string, unknown>
) {
  switch (name) {
    case "get_incident":
      return getIncident(String(input.incidentId));

    case "get_payment":
      return getPayment(String(input.paymentId));

    case "get_customer":
      return getCustomer(String(input.customerId));

    case "get_payment_history":
      return getPaymentHistory(String(input.customerId));

    case "get_available_methods":
      return getAvailableMethods(String(input.customerId));

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function investigateIncident(incidentId: string) {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `
Investigate payment incident ${incidentId}.

You are a revenue incident investigation agent.

Your objective is to protect revenue while minimizing:
- customer friction
- financial risk

Use the available tools to gather the evidence you need.

Do not assume information that has not been returned by tools.

Do not infer facts about failure codes or payment behavior unless a tool explicitly provides that information.

Choose exactly one strategy:

RETRY_PAYMENT
ALTERNATIVE_METHOD
ESCALATE

Do not perform any financial action.

When you have enough evidence, you MUST call submit_recovery_decision.

Every evidence item must come directly from information returned by tools.

Do not return the final decision as free-form text.
`,
    },
  ];

  const trace: Array<{
    type: string;
    name?: string;
    input?: unknown;
    result?: unknown;
  }> = [];

  for (let step = 0; step < 10; step++) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1200,
      tools,
      messages,
    });

    messages.push({
      role: "assistant",
      content: response.content,
    });

    const toolCalls = response.content.filter(
      (block) => block.type === "tool_use"
    );

    if (toolCalls.length === 0) {
      throw new Error(
        "Agent stopped without submitting a recovery decision"
      );
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const call of toolCalls) {
      if (call.name === "submit_recovery_decision") {
        trace.push({
          type: "decision",
          name: call.name,
          input: call.input,
        });

        return {
          decision: call.input,
          trace,
        };
      }

      const result = await executeTool(
        call.name,
        call.input as Record<string, unknown>
      );

      trace.push({
        type: "tool_call",
        name: call.name,
        input: call.input,
        result,
      });

      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({
      role: "user",
      content: toolResults,
    });
  }

  throw new Error("Agent exceeded maximum investigation steps");
}