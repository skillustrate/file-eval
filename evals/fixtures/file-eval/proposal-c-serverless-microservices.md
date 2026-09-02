# Architecture Proposal C: Serverless Event Grid with Managed Cloud Services

## Executive Summary
This proposal recommends an entirely cloud-native, serverless architecture leveraging AWS Lambda, EventBridge, and DynamoDB to minimize fixed server overhead and scale to zero during off-peak hours.

## Core Architecture
- **API Gateway**: AWS HTTP API Gateway v2 with JWT authorizers
- **Compute**: Rust/Go AWS Lambda functions running on AWS Graviton3 (ARM64)
- **Message Router**: AWS EventBridge Pipes + SQS FIFO Queues for burst leveling
- **Storage**: Amazon DynamoDB with Global Tables and Point-in-Time Recovery (PITR)
- **Analytics Store**: Amazon Athena federated queries over S3 Iceberg tables

## Strengths
- True scale-to-zero pricing: Zero fixed compute cost during idle periods.
- Zero server maintenance, automated OS patching, and built-in multi-AZ redundancy.
- Rapid deployment velocity using Terraform / AWS CDK blueprints.

## Identified Weaknesses & Trade-offs
- Cold start penalties (200-500ms) on bursty traffic spikes.
- Risk of vendor lock-in to AWS proprietary primitives (EventBridge, DynamoDB Streams).
- Unpredictable runaway cloud costs under sustained distributed denial or sudden traffic floods.
