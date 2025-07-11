// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Store all markdown content in a JavaScript object
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
It's the central hub for all interactions. It validates and configures data for API objects (pods, services, deployments, etc.) and provides a consistent interface to the shared state of the cluster (stored in \`etcd\`).
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

## 📦 Helm Release Management (Bonus)
If you're using Helm:
\`\`\`bash
helm list -A                                # List all Helm releases
helm uninstall <release> -n <namespace>     # Uninstall a Helm release
helm get values <release> -n <namespace>    # Get values used for a release
helm upgrade <release> <chart> -f values.yaml  # Upgrade release with new values
\`\`\`

## 🗂 Namespaces & Scoping
\`\`\`bash
kubectl get ns                              # List namespaces
kubectl get pods -n <namespace>             # List pods in namespace
kubectl delete ns <namespace>               # Delete a namespace (careful!)
\`\`\`

## 🔌 Port Forwarding & Access
\`\`\`bash
kubectl port-forward pod/<pod-name> 8080:80   # Local 8080 → Pod 80
kubectl port-forward svc/<service> 9090:9090  # Forward to service
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

## 💡 Other Useful
\`\`\`bash
kubectl top pod                             # Resource usage per pod
kubectl top node                            # Resource usage per node
kubectl cp <pod>:/path/in/pod /local/path   # Copy from pod to local
\`\`\`
`
    };

    // Get references to all the necessary HTML elements
    const contentDisplay = document.getElementById('content-display');
    const navLinksContainer = document.getElementById('nav-links');
    const summarizeBtn = document.getElementById('summarize-btn');
    const quizBtn = document.getElementById('quiz-btn');
    const modal = document.getElementById('ai-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    let currentTopic = 'cheat-sheet';

    // Function to display content for a given topic
    function showContent(topic) {
        currentTopic = topic;
        const content = markdownContent[topic];

        // Use marked.parse() to convert markdown to HTML
        contentDisplay.innerHTML = marked.parse(content);
        
        // Update the 'active' class on the navigation links
        const links = navLinksContainer.querySelectorAll('a');
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.topic === topic);
        });
    }

    // Add a single event listener to the navigation container
    navLinksContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;
        // Check if a link was clicked
        if (target.tagName === 'A' && target.dataset.topic) {
            showContent(target.dataset.topic);
        }
    });

    // --- Gemini API Integration ---

    function showModal(title) {
        modalTitle.textContent = title;
        modalBody.innerHTML = '<div class="loader"></div>';
        modal.classList.add('visible');
    }

    function hideModal() {
        modal.classList.remove('visible');
    }

    async function callGemini(prompt) {
        const apiKey = ""; // API key will be provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                // Also use marked.parse for the modal content
                modalBody.innerHTML = marked.parse(text);
            } else {
                throw new Error("Invalid response structure from API.");
            }

        } catch (error) {
            console.error("Gemini API call failed:", error);
            modalBody.innerHTML = `<p>Sorry, something went wrong. Please try again later. Error: ${error.message}</p>`;
        }
    }

    summarizeBtn.addEventListener('click', () => {
        showModal('✨ AI Summary');
        const content = markdownContent[currentTopic];
        const prompt = `Please summarize the following CKA study guide topic in a few key bullet points. Focus on the most critical information for someone preparing for the exam. The topic is "${currentTopic}". Here is the content:\n\n---\n\n${content}`;
        callGemini(prompt);
    });

    quizBtn.addEventListener('click', () => {
        showModal('✨ AI Quiz');
        const content = markdownContent[currentTopic];
        const prompt = `Based on the following CKA study material about "${currentTopic}", generate 3 multiple-choice quiz questions with 4 options each (A, B, C, D). The questions should be in a markdown format. Bold the correct answer for each question. Here is the content:\n\n---\n\n${content}`;
        callGemini(prompt);
    });

    // Event listeners for closing the modal
    modalCloseBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (event) => {
        // Close modal if the overlay is clicked, but not the content inside it
        if (event.target === modal) {
            hideModal();
        }
    });

    // Show the cheat sheet by default when the page loads
    showContent('cheat-sheet');
});
