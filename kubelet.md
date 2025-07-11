# kubelet: The Node Agent

## What it is

The `kubelet` is the primary "node agent" that runs on each node in the cluster. It ensures that containers are running in a Pod.

## Why it's Important

It's the direct link between the node and the Kubernetes control plane. It receives PodSpecs (definitions of pods) from the API Server and ensures those Pods and their containers are running as expected on its node by interacting with the container runtime.

## Key Functions

- **Pod Management:** Receives PodSpecs and runs the specified containers through a container runtime (e.g., containerd, Docker).
- **Container Health Monitoring:** Continuously monitors the health of containers running on its node using liveness and readiness probes, and reports their status to the API Server.
- **Resource Management:** Manages resource allocation for containers (CPU, memory, storage).
- **Node Registration:** Registers the node with the API Server and reports its capabilities and status.
- **Volume Management:** Mounts and unmounts volumes for pods.

## CKA Relevance

- Crucial for understanding how applications run on nodes.
- Troubleshooting pod lifecycle issues (e.g., `CrashLoopBackOff`, `Pending` due to resource issues).
- Node health and reporting.
- Understanding how `kubelet` interacts with container runtimes (e.g., `containerd`).
- Static Pods: `kubelet` can run pods defined on the node's filesystem, even without API Server interaction.

## Basic Interaction (Implicit)

When the scheduler assigns a Pod to a node, the `kubelet` on that node takes over.

```bash
# (kubectl interacts with kube-apiserver, which then communicates to kubelet)
kubectl get pod my-nginx-pod -o wide # Shows which node the pod is running on
```
