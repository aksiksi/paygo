# TODO

- [x] Evaluate gRPC vs. JSON
- [x] Finalize initial architecture
- [ ] Build a simple SPA for the payment form using React + Tailwind
- [ ] Tools
    - [ ] Redis: caching and task queues
        - [ ] SQS: task queues
    - [ ] Postgres: all DBs
    - [ ] dbmate: DB migrations (?)
    - [ ] Logging: Logstash + Elasticsearch
        - [ ] Structured logs in Go: https://github.com/uber-go/zap
        - [ ] Logstash runs on each machine and exports logs to Elastic
- [ ] Deploy: Ansible + Packer + Terraform
- [ ] Look into HTTP server testing
- [ ] Metrics
