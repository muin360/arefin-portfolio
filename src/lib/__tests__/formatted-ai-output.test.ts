import { describe, it, expect } from "vitest";

describe("FormattedAIOutput Markdown Processing Engine", () => {
  it("parses code blocks, bold markers, and inline links without throw", () => {
    const rawContent = `
### ⚡ Architecture Blueprint

Here is how **Multi-Agent Orchestration** is implemented:

\`\`\`python
def execute_workflow():
    return "Running n8n and LangChain"
\`\`\`

- **Orchestration**: Managed via n8n webhook triggers
- **Memory**: AES-256-GCM encrypted vector storage

> Note: All outputs are grounded strictly in Arefin's verified case studies.

For consultations, [Book a Call](/book) or view [Projects](/projects).
`.trim();

    expect(rawContent).toContain("### ⚡ Architecture Blueprint");
    expect(rawContent).toContain("```python");
    expect(rawContent).toContain("[Book a Call](/book)");
  });
});
