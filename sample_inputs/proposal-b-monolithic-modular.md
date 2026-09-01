# Architecture Proposal B: Modular Monolith on High-Core Compute

## Executive Summary
This proposal advocates for a modular monolithic architecture built in Rust/Actix-web deployed across redundant high-core bare-metal servers, prioritizing low deployment complexity, ultra-low in-memory latency, and single-binary maintainability.

## Core Architecture
- **Application Core**: Rust single binary structured in domain modules (auth, telemetry, analytics)
- **Inter-module Communication**: In-memory async channels (Tokio mpsc) with zero network serialization overhead
- **Storage**: Primary PostgreSQL 16 cluster with pg_timescale extension and PgBouncer connection pooling
- **Caching**: Embedded RocksDB for hot counters and Redis Sentinel for distributed session cache

## Strengths
- Unmatched compute efficiency and sub-millisecond execution times.
- Zero distributed system network latency or partition failures between internal domains.
- Extremely simple CI/CD and single command local development environment.

## Identified Weaknesses & Trade-offs
- Scaling requires vertical instance upgrades or manual read-replica sharding.
- Blast radius: A fatal panic or memory leak in one domain module could bring down the entire binary.
- Long-term team scaling challenges if module boundaries are violated by contributors.
