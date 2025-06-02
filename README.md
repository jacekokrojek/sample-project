# Uruchamianie testów k6 w Kubernetes (EKS)

Poniższy opis przeprowadzi Cię przez proces przygotowania i uruchomienia skryptów testowych w klastrze EKS na platformie AWS, z wykorzystaniem `kubectl` i konfiguracji dla narzędzia Prometheus.

## Wymagania wstępne
Do wykonania instrukcji potrzebujemy:
* klastra k8s
* zainstalowanego k6-operator

W moim przypadku korzystam z klastra Elastic Kubernetes Service (EKS). Instrukcję instalacji znajdziesz na końcu materiału.

## 1. Logowanie do klastra EKS

W moim przypadku pracuję z klastrem o nazwie `k6-quickstart-06`. Aby wskazać, że chcę na nim pracować wykonuję komendę: 

```bash
aws eks --region eu-central-1 update-kubeconfig --name k6-quickstart-06
```

Dzięki temu nasz `kubectl` wie, z którym klastrem powinien się komunikować.

## 2. Tworzenie przestrzeni nazw (Namespace)

Stwórz przestrzeń nazw aby odizolować swoje narzędzia od innych. 

```bash
kubectl create namespace k6-demo-tester
```
Namespace „k6-demo-tester” to przykładowa nazwa – dostosuj ją do swojego imienia, nickname’u lub innego identyfikatora.

## 3. Tworzenie ConfigMap ze skryptami testowymi

```bash
kubectl create configmap -n k6-demo-tester test-scripts \
--from-file=./archive-test/archive.tar \
--from-file=./single-file-test/svg-download-test.js
```

Weryfikacja:

```bash
kubectl describe configmap test-scripts -n k6-demo-tester
```

## 4. Konfiguracja Prometheus Remote Write

```bash
kubectl create configmap -n k6-demo-tester prometheus-config \
--from-literal=K6_PROMETHEUS_RW_SERVER_URL="http://<ip-address>:9090/api/v1/write"
```

## 5. Uruchomienie testu

```bash
kubectl apply -n k6-demo-tester -f k6-single-test-runner.yaml
```

Sprawdzenie poda:

```bash
kubectl get pod -n k6-demo-tester
```

Podejrzenie logów:

```bash
kubectl logs -n k6-demo-tester <pod-name>
kubectl logs -f <pod-name>
```

## 6. Usuwanie zasobów po teście

```bash
kubectl delete -n k6-demo-tester -f k6-single-test-runner.yaml
```

## Instalacja klastra i narzędzi do pracy z EKS
### Setting up Amazon access

Follow https://docs.aws.amazon.com/eks/latest/userguide/install-awscli.html

### Verify that aws cli is set up correctly

aws sts get-caller-identity
aws sts get-session-token --duration-seconds 3600

### Install or update kubctl
https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html#kubectl-install-update

### Setting up cluseter
https://docs.aws.amazon.com/eks/latest/userguide/quickstart.html

eksctl create cluster -f 001-cluster-config.yaml

### Deploy k6 Operator with Helm

helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install k6-operator grafana/k6-operator

To check deployment
kubectl get pod -n k6-operator-system

### Troubleshooting

* https://blog.devops.dev/your-own-k6-cloud-in-amazon-eks-easy-way-out-be36dd9ed633
* https://grafana.com/blog/2022/06/23/running-distributed-load-tests-on-kubernetes/

