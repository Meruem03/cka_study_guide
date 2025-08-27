document.addEventListener('DOMContentLoaded', () => {

    const markdownContent = {
        'etcd': `
# etcd: The Kubernetes Brain

## What it is
\`etcd\` is a highly available, distributed, and consistent key-value store. It serves as the **single source of truth** for the entire Kubernetes cluster. All cluster data, including the desired state of deployments, configurations, network information, and the actual state of pods and nodes, is stored in \`etcd\`.

## Why it's Important
If \`etcd\` goes down, your Kubernetes cluster effectively becomes read-only and cannot make any changes. It's the "brain" of the cluster.
`,
        'kube-apiserver': `
# kube-apiserver: The Cluster Gateway

## What it is
The \`kube-apiserver\` is the **front-end** of the Kubernetes control plane. It exposes the Kubernetes API. All communication between cluster components (e.g., \`kubelet\`, \`kube-scheduler\`, \`kube-controller-manager\`) and external users (via \`kubectl\`) goes through the API Server.

## Why it's Important
It's the central hub for all interactions.
`,
        'kube-scheduler': `
# kube-scheduler: The Pod Placer

## What it is
The \`kube-scheduler\` watches for newly created Pods that have no node assigned. For each new Pod, it selects an optimal Node for it to run on, based on various factors.

## CKA Relevance
* Understanding scheduling principles.
* **Taints and Tolerations:** Used to prevent pods from being scheduled on (taint) or allowing them to be scheduled on (toleration) specific nodes.
* **Node Selectors and Node Affinity:** Used to constrain pods to specific nodes or groups of nodes.
`,
        'kube-controller-manager': `
# kube-controller-manager: The State Keeper

## What it is
The \`kube-controller-manager\` runs various **controller processes**. A controller is a control loop that watches the shared state of the cluster through the API Server and makes changes attempting to move the current state towards the desired state.

## Examples of Controllers it manages
* **Node Controller:** Responsible for noticing and responding when nodes go down.
* **Replication Controller (or ReplicaSet Controller):** Ensures that a specified number of replica Pods are running for a given workload.
* **Endpoints Controller:** Populates the Endpoints object (which links Services to Pods).
`,
        'kubelet': `
# kubelet: The Node Agent

## What it is
The \`kubelet\` is the primary "node agent" that runs on each node in the cluster. It ensures that containers are running in a Pod.

## Key Functions
* **Pod Management:** Receives PodSpecs and runs the specified containers through a container runtime (e.g., containerd, Docker).
* **Container Health Monitoring:** Continuously monitors the health of containers running on its node using liveness and readiness probes, and reports their status to the API Server.
`,
        'kube-proxy': `
# kube-proxy: The Network Proxy

## What it is
The \`kube-proxy\` is a network proxy that runs on each node in the cluster. It maintains network rules on nodes, enabling network communication to your Pods from inside or outside the cluster.

## Why it's Important
It handles Service abstraction, ensuring that traffic destined for a Service IP is correctly routed to the appropriate Pods, even as Pods are created, deleted, or moved. It provides the core networking functionality for Kubernetes Services.
`,
        'cheat-sheet': `
# CKA Quick Reference / Cheat Sheet

This is a concise guide to common \`kubectl\` commands and essential Kubernetes concepts for the Certified Kubernetes Administrator (CKA) exam.

## 🚦Core Resource Management
\`\`\`bash
kubectl get pods                            # List pods in current namespace
kubectl get pods -A                         # List all pods in all namespaces
kubectl get deployments                     # List deployments
kubectl get svc                             # List services
kubectl get all                             # Get all resources in namespace
kubectl get events --sort-by=.metadata.creationTimestamp  # Recent events
\`\`\`

## 🔍 Inspect & Debug
\`\`\`bash
kubectl describe pod <pod-name>             # Detailed info about a pod
kubectl describe deployment <name>          # Deployment details
kubectl get pod <pod-name> -o yaml          # Get full YAML of pod
\`\`\`

## 📜 API & Resource Schema Inspection
The \`explain\` command is your built-in API documentation. It's essential for finding field names and understanding the structure of objects when writing YAML.

\`\`\`bash
# Get documentation for the Pod resource
kubectl explain pod

# Drill down into the 'spec' field of a Pod
kubectl explain pod.spec

# See all the fields for a container
kubectl explain pod.spec.containers

# Find out what the 'imagePullPolicy' field does
kubectl explain pod.spec.containers.imagePullPolicy
\`\`\`

## 📜 Logs & Exec
\`\`\`bash
kubectl logs <pod>                          # Get logs from pod
kubectl logs <pod> -c <container>           # From specific container
kubectl logs -f <pod>                       # Follow logs
kubectl exec -it <pod> -- /bin/bash         # Bash shell into container (if available)
kubectl exec -it <pod> -c <container> -- /bin/sh  # sh shell if bash missing
\`\`\`

## ⚙️ Apply, Update, Rollout
\`\`\`bash
kubectl apply -f <file>.yaml                # Create or update resource
kubectl delete -f <file>.yaml               # Delete resources
kubectl rollout restart deployment <name>   # Force restart
kubectl rollout status deployment <name>    # Check rollout progress
kubectl edit deployment <name>              # Edit live deployment in editor
\`\`\`

## 💣 Delete & Clean Up
\`\`\`bash
kubectl delete pod <name>                   # Delete pod
kubectl delete deployment <name>           # Delete deployment
kubectl delete svc <name>                  # Delete service
kubectl delete ingress <name>              # Delete ingress
kubectl delete job <job-name>              # Delete job
kubectl delete pvc <name>                  # Delete persistent volume claim
\`\`\`

---

## Creating Resources from the Command Line

### Pods and Deployments
This is a common workflow for quickly creating resources and generating YAML manifests.

\`\`\`bash
# Create a simple Nginx pod
kubectl run nginx --image=nginx

# Generate POD Manifest YAML file (-o yaml). 
# Don't create it(--dry-run=client)
kubectl run nginx --image=nginx --dry-run=client -o yaml

# Create a deployment named 'nginx'
kubectl create deployment --image=nginx nginx

# Generate Deployment YAML file. Don't create it.
kubectl create deployment --image=nginx nginx --dry-run=client -o yaml

# Generate Deployment YAML and save it to a file.
kubectl create deployment --image=nginx nginx --dry-run=client -o yaml > nginx-deployment.yaml

# You can now edit the YAML file, for example, to change the number of replicas.
# Then, create the resource from the modified file.
kubectl create -f nginx-deployment.yaml

# Alternatively, create a deployment with 4 replicas directly
kubectl create deployment --image=nginx nginx --replicas=4 --dry-run=client -o yaml > nginx-deployment.yaml
\`\`\`

---

## Kubectl Usage Conventions & Best Practices

### Using kubectl in Reusable Scripts
For stable and predictable output in scripts:
- **Use machine-readable output:** Request formats like \`-o name\`, \`-o json\`, \`-o yaml\`, \`-o go-template\`, or \`-o jsonpath\`.
- **Specify API versions:** Fully-qualify resource versions, like \`jobs.v1.batch/myjob\`. This prevents issues if the default version changes in later releases.
- **Avoid implicit state:** Don't rely on the current context, preferences, or other states that can change outside the script.

### Subresources
You can manage subresources like \`status\` and \`scale\` directly.
\`\`\`bash
# Get the scale subresource for a deployment
kubectl get deployment nginx --subresource=scale

# Note: 'kubectl edit' does not support the 'scale' subresource.
\`\`\`

### Best Practices for \`kubectl run\` and \`kubectl apply\`
- **\`kubectl run\`:**
    - Use specific image tags (e.g., \`my-image:v1.2.3\`) instead of \`:latest\` to ensure your deployments are predictable.
    - For complex configurations, switch to YAML files stored in source control.
    - Always use the \`--dry-run=client\` flag to preview the object before submitting it to the cluster. This is crucial for preventing mistakes.
- **\`kubectl apply\`:**
    - This is the preferred method for managing resources declaratively. It allows you to create resources if they don't exist or update them if they do, based on a YAML file.
    \`\`\`bash
    # Apply changes from a file. If the resource exists, it's updated. If not, it's created.
    kubectl apply -f nginx-deployment.yaml
    \`\`\`

## 📦 Helm Release Management (Bonus)
If you're using Helm:
\`\`\`bash
helm list -A                                # List all Helm releases
helm uninstall <release> -n <namespace>     # Uninstall a Helm release
helm get values <release> -n <namespace>    # Get values used for a release
helm upgrade <release> <chart> -f values.yaml  # Upgrade release with new values
\`\`\`

## 💡 Other Useful Commands
\`\`\`bash
kubectl top pod                             # Resource usage per pod
kubectl top node                            # Resource usage per node
kubectl cp <pod>:/path/in/pod /local/path   # Copy from pod to local
\`\`\`
`
    };


    const contentDisplay = document.getElementById('content-display');
    const navLinksContainer = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    let currentTopic = 'cheat-sheet';

    function showContent(topic) {
        currentTopic = topic;
        const content = markdownContent[topic];
        contentDisplay.innerHTML = marked.parse(content);
        
        const links = navLinksContainer.querySelectorAll('a');
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.topic === topic);
        });

        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
        }
    }

    navLinksContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target.closest('a');
        if (target && target.dataset.topic) {
            showContent(target.dataset.topic);
        }
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    showContent('cheat-sheet');
});
