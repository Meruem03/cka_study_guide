# CKA Quick Reference / Cheat Sheet

This is a concise guide to common `kubectl` commands and essential Kubernetes concepts for the Certified Kubernetes Administrator (CKA) exam.

## General `kubectl` Commands

- **List resources:**
  - `kubectl get pods`
  - `kubectl get deployments`
  - `kubectl get services`
  - `kubectl get nodes`
  - `kubectl get all` (gets a lot of common resources)
  - `kubectl get pods -o wide` (more details, including node)
  - `kubectl get pod <pod-name> -o yaml` (full YAML definition)
  - `kubectl get pods --show-labels`
  - `kubectl get pods -l app=nginx` (filter by label)
- **Describe resources:**
  - `kubectl describe pod <pod-name>` (detailed info, events, conditions)
  - `kubectl describe node <node-name>`
  - `kubectl describe deployment <deployment-name>`
- **Create/Apply/Delete:**
  - `kubectl create -f <file.yaml>` (creates new resources, errors if already exists)
  - `kubectl apply -f <file.yaml>` (creates or updates resources, idempotent)
  - `kubectl delete -f <file.yaml>`
  - `kubectl delete pod <pod-name>`
  - `kubectl delete deployment <deployment-name>`
  - `kubectl delete all --all-namespaces` (DANGER: Deletes everything in all namespaces!)
- **Execute commands in a Pod:**
  - `kubectl exec -it <pod-name> -- bash` (interactive shell)
  - `kubectl exec <pod-name> -- ls /app` (run a command)
- **Logs:**
  - `kubectl logs <pod-name>`
  - `kubectl logs -f <pod-name>` (follow logs)
  - `kubectl logs <pod-name> -c <container-name>` (if multiple containers in pod)
  - `kubectl logs --previous <pod-name>` (logs from previous instance)
- **Contexts & Config:**
  - `kubectl config get-contexts`
  - `kubectl config use-context <context-name>`
  - `kubectl config view`
  - `kubectl config current-context`
  - `kubectl config delete-context <context-name>`
- **Autocompletion (Bash):**
  - `source <(kubectl completion bash)`
  - `echo "source <(kubectl completion bash)" >> ~/.bashrc`
  - `alias k=kubectl`
  - `complete -o default -F __start_kubectl k`

---

## Key Kubernetes Concepts & Components

### Pods

- **Smallest deployable units**, encapsulate one or more containers.
- **YAML Structure (basic):**
  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-pod
    labels:
      app: my-app
  spec:
    containers:
      - name: my-container
        image: nginx:latest
        ports:
          - containerPort: 80
  ```
- **RestartPolicy:** `Always` (default), `OnFailure`, `Never`.
- **Probes:**
  - `livenessProbe`: Checks if the container is running and healthy. If fails, Kubelet restarts container.
  - `readinessProbe`: Checks if the container is ready to serve traffic. If fails, endpoint controller removes pod from service.

### Deployments

- **Manages a set of identical Pods**, ensures a desired number of replicas are running.
- Provides **declarative updates** to Pods and ReplicaSets.
- **Scaling:** `kubectl scale deployment <deployment-name> --replicas=<number>`
- **Rollout Status:** `kubectl rollout status deployment/<deployment-name>`
- **Rollback:** `kubectl rollout undo deployment/<deployment-name>` (to previous revision)
- **History:** `kubectl rollout history deployment/<deployment-name>`

### Services

- **Abstract way to expose an application** running on a set of Pods as a network service.
- **Types:**
  - `ClusterIP` (default): Internal IP, only reachable from within the cluster.
  - `NodePort`: Exposes the Service on each Node's IP at a static port. Accessible from outside.
  - `LoadBalancer`: Creates an external cloud load balancer (if running on a cloud provider).
  - `ExternalName`: Maps a Service to a DNS name (no proxy involved).
- **YAML Structure (ClusterIP example):**
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: my-service
  spec:
    selector:
      app: my-app # Selects pods with this label
    ports:
      - protocol: TCP
        port: 80 # Service port
        targetPort: 8080 # Pod port
    type: ClusterIP
  ```

### Namespaces

- Provides a mechanism for **isolating groups of resources** within a single cluster.
- **Commands:**
  - `kubectl get namespaces`
  - `kubectl create namespace <name>`
  - `kubectl get pods -n <namespace-name>` (specify namespace)
  - `kubectl config set-context --current --namespace=<namespace-name>` (set default namespace for current context)

### Nodes

- **Cordoning:** `kubectl cordon <node-name>` (marks node as unschedulable, existing pods remain)
- **Uncordoning:** `kubectl uncordon <node-name>` (marks node as schedulable again)
- **Draining:** `kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data` (evicts pods from a node gracefully, used for maintenance)
- **Labeling:** `kubectl label node <node-name> <key>=<value>`
- **Tainting:** `kubectl taint node <node-name> <key>=<value>:<effect>` (e.g., `NoSchedule`, `NoExecute`, `PreferNoSchedule`)

### Storage

- **PersistentVolume (PV):** Cluster-scoped storage resource provisioned by an administrator.
- **PersistentVolumeClaim (PVC):** Request for storage by a user, bound to a PV.
- **StorageClass:** Provides a way for administrators to describe the "classes" of storage they offer (e.g., fast SSD, slow HDD). Dynamic provisioning of PVs.

### Networking

- **Cluster IP:** IP assigned to a Service, internal to the cluster.
- **Pod IP:** IP assigned to each Pod, unique within the cluster.
- **Service Name:** DNS name for a service (e.g., `my-service.my-namespace.svc.cluster.local`).
- **Ingress:** Manages external access to services within a cluster, typically HTTP/S.
- **Network Policies:** Specify how groups of pods are allowed to communicate with each other and other network endpoints.

### Authentication & Authorization

- **Authentication:** Who are you? (e.g., X.509 client certs, Service Accounts, Bearer Tokens)
- **Authorization:** What can you do? (e.g., RBAC - Role-Based Access Control)
- **Service Accounts:** Provide an identity for processes that run in a Pod.

---

## Troubleshooting Essentials

- `kubectl get events` (cluster-wide events, very useful)
- `kubectl describe <resource> <name>` (always check the "Events" section at the bottom)
- `kubectl logs <pod-name>` (check container logs)
- `kubectl exec -it <pod-name> -- <command>` (debug inside the container)
- Check `kubelet` logs: `journalctl -u kubelet` (on worker nodes)
- Check Control Plane component logs: `journalctl -u <component>` (e.g., `kube-apiserver`, `kube-scheduler`, `kube-controller-manager` on master nodes)
- Use `kubectl top nodes` and `kubectl top pods` (requires Metrics Server) to check resource usage.
- Verify network connectivity (`ping`, `curl` from within a pod).
- Check `kubectl get all --all-namespaces` to see if resources are in unexpected namespaces.
- Verify YAML syntax: `kubectl create --dry-run=client -o yaml -f <file.yaml>`
