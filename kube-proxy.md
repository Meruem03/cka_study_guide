# kube-proxy: The Network Proxy

## What it is

The `kube-proxy` is a network proxy that runs on each node in the cluster. It maintains network rules on nodes, enabling network communication to your Pods from inside or outside the cluster.

## Why it's Important

It handles Service abstraction, ensuring that traffic destined for a Service IP is correctly routed to the appropriate Pods, even as Pods are created, deleted, or moved. It provides the core networking functionality for Kubernetes Services.

## Modes of Operation (most common for CKA)

- **`iptables` mode (default):** `kube-proxy` creates `iptables` rules on the node to capture traffic to Service IPs and randomly distribute it to the healthy Pods backing that Service. This is the most common and robust mode.
- **`ipvs` mode:** Uses IP Virtual Server for more advanced load balancing algorithms (e.g., round-robin, least connections) and potentially better performance for very large clusters.
- **`userspace` mode (legacy):** Less efficient, not typically used in modern Kubernetes.

## CKA Relevance

- Understanding how Services expose applications.
- How `kube-proxy` facilitates network connectivity and load balancing within the cluster.
- Troubleshooting network connectivity issues to pods via services.
- Understanding the different modes and their implications.

## Basic Interaction (Implicit)

When you create a Service, `kube-proxy` configures network rules on each node.

```yaml
# Example: A Service definition
apiVersion: v1
kind: Service
metadata:
  name: my-web-service
spec:
  selector:
    app: my-web-app
  ports:
    - protocol: TCP
      port: 80 # Service port (ClusterIP, NodePort, LoadBalancer will listen on this)
      targetPort: 8080 # Pod port (traffic is forwarded to this port on selected pods)
  type: ClusterIP # Or NodePort, LoadBalancer
```
