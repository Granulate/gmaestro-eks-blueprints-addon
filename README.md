# gMaestro add-on for Amazon EKS Blueprints

This repository contains the source code for the gMaestro add-on for [Amazon EKS Blueprints](https://aws-quickstart.github.io/cdk-eks-blueprints/). This AddOn is a [CDK](https://aws.amazon.com/cdk/) construct that allows customers to add gMaestro to their Amazon EKS clusters.

gMaestro is a Kubernetes cost optimization solution that helps companies reduce spending on unutilized resources by up to 60%.
With gMaestro, you gain full visibility into K8s clusters, seamlessly interact with HPA scaling policies, and achieve your cost-performance goals by applying custom rightsizing recommendations based on actual usage in production.
1. **Install gMaestro** - As a single pod on your cluster with a single command line.
2. **Multi-cluster visibility** - Gain visibility into each controller, resource request, container, HPA policy, utilization, and cost.
3. **Apply custom recommendations** - gMaestro generates custom recommendations by analyzing the actual utilization of each controller.

For additional information, visit [gMaestro documentation](https://gmaestro.gitbook.io/gmaestro-docs/).

## Prerequisite 
Before using gMaestro, you need to:
1. [Sign up](https://app.granulate.io/gMaestroSignup) to the gMaestro platform
2. Download a sample YAML file - After signing up to gMaestro, navigate to the [Deploy](https://app.granulate.io/deploy) on the left-hand menu, fill in the required fields and click on "Generate Config File" 

![GmaestroGenerateConfigFile](assets/images/gmaestro-generate-config-file.png)

![GmaestroConfigFile](assets/images/gmaestro-config-file.png)

3. Create 3 secrets (as a plaintext) in AWS Secrets Manager copy their values from the following places:
   1. Deployment section `MAESTRO_CLIENT_ID`
   2. ConfigMap section `prometheus.configs.remote_write.basic_auth.password`.
   3. ConfigMap section `loki.configs.clients.basic_auth.password`

## Installation

Using [npm](https://npmjs.org):

```bash
$ npm i @granulate/gmaestro-eks-blueprints-addon
```

## Usage

```typescript
import 'source-map-support/register';
import * as CDK from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import {GmaestroAddOn} from '@granulate/gmaestro-eks-blueprints-addon';

const app = new cdk.App();

const addOn = new GmaestroAddOn({
        clientIdSecretName: "<client id secret name>", // Create and copy from gMaestro deployment yaml
        clientName: "<client name>",
        clusterName: "<cluster name>",
        namespace: "<namespace>",
        grafanaMetricsSecretName: "<grafana metrics secret name>", // Create and copy from gMaestro deployment yaml
        grafanaLogsSecretName: "<grafana logs secret name>", // Create and copy from gMaestro deployment yaml
    });

const blueprint = blueprints.EksBlueprint.builder()
  .addOns(addOn)
  .build(app, 'my-stack-name');
```

Use the following command to validate that gMaestro installed successfully:

```bash
$ kubectl get pods --all-namespaces | grep granulate-maestro

NAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE
default       granulate-maestro-6947dc87bc-k5nfc   2/2     Running   0          11m
kube-system   aws-node-9rhgx                       1/1     Running   0          16m
kube-system   coredns-d5b9bfc4-8v8k5               1/1     Running   0          21m
kube-system   coredns-d5b9bfc4-r5sdb               1/1     Running   0          21m
kube-system   kube-proxy-js5pn                     1/1     Running   0          16m
```

After a few seconds, you will gain full visibility into your K8s cluster objects.
The first rightsizing recommendations may take up to 5 minutes to load.

## `gMaestroAddOn` Required (props)
Take the following parameter from the sample YAML file that was downloaded.

#### `clientIdSecretName: string`

The secret name from the Prerequisite section 3.i.

#### `clientName: string`

Copy from the ConfigMap section `prometheus.configs.scrape_configs.static_configs.labels.client_name` value

#### `clusterName: string`

Copy from the Deployment section `MAESTRO_SERVICE_NAME` value

#### `namespace: string` (optional)

The namespace where gMaestro will be installed. `default` namespace is used as default.

#### `grafanaMetricsSecretName: string`

The secret name from the Prerequisite section 3.ii.

#### `grafanaLogsSecretName: string`

The secret name from the Prerequisite section 3.iii.

## Support

If you have questions about Gmaestro, catch us [on Slack](https://granulatecommunity.slack.com/archives/C03RK0HN2TU)!

## License

The gMaestro add-on is licensed under the Apache 2.0 license.
