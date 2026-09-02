# Architecture Proposal A: Event-Driven Distributed Pipeline

## Executive Summary
This proposal advocates for a fully decoupled event-driven architecture using Apache Kafka and Go-based consumer microservices to process high-throughput telemetry streams (50k events/sec).

## Core Architecture
- **Message Broker**: Confluent Kafka (3 broker cluster with replication factor 3)
- **Ingestion Layer**: Go worker pool with gRPC endpoints
- **Storage**: ClickHouse for fast time-series analytics, ScyllaDB for user state
- **Schema Management**: Protobuf with Confluent Schema Registry

## Strengths
- Exceptional horizontal scalability and low ingestion latency (<10ms).
- Event replay capability allows disaster recovery and retroactive data re-processing.
- Independent service scaling based on queue depth.

## Identified Weaknesses & Trade-offs
- Operational overhead of Kafka cluster management and schema evolution coordination.
- Eventual consistency requires complex client-side reconciliation.
- Higher baseline infrastructure cost for small-to-medium loads.
