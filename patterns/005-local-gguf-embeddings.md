# Pattern 005: Local GGUF Embeddings for On-Device Memory

**Date:** 2026-02-11
**Source:** Architecture deep-dive (Context7 official docs)

## Problem

AI agent memory search typically requires sending data to cloud embedding APIs, which means your private conversations and agent memory leave your infrastructure every time the agent searches its own context.

## Context

- OpenClaw's memory search uses embeddings to find relevant past context
- Default configuration sends data to cloud embedding providers
- Data residency is a core concern: "Every message Sean sends to the bot goes to the LLM provider"
- M4 Mac Mini has a 38 TOPS Neural Engine designed for on-device ML inference
- Sean's deployment prioritizes data sovereignty

## Solution

Configure **local GGUF embeddings** so memory search runs entirely on the Mac Mini:

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "local",
        local: { modelPath: "path/to/your/model.gguf" },
        fallback: "none"  // Do not fall back to cloud
      }
    }
  }
}
```

## Evidence

- Official docs explicitly support local embedding provider with GGUF models (Tier 1)
- M4 Neural Engine at 38 TOPS handles embedding generation with sub-millisecond latency (Scaleway, Tier 2)
- Embedding creation stays entirely on-device — no data leaves the Mac Mini for memory search (Tier 1)
- Session memory search (experimental) can also use local embeddings (Tier 1)

## Trade-offs

- **Pro:** Embedding data never leaves the Mac Mini
- **Pro:** No cloud API costs for embedding generation
- **Pro:** M4 Neural Engine is purpose-built for this workload
- **Pro:** Zero latency — no network round-trip for memory queries
- **Con:** Requires downloading and managing a GGUF model file
- **Con:** Uses some RAM for the loaded model (varies by model size)
- **Con:** Local model may produce lower-quality embeddings than frontier cloud models
- **Revisit when:** Testing during deployment to find the optimal model size for 16GB RAM
