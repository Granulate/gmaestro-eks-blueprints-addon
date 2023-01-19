# gMaestro AddOn for Amazon EKS Blueprints

This repository contains the source code for the gMaestro AddOn for [Amazon EKS Blueprints](https://aws-quickstart.github.io/cdk-eks-blueprints/). This AddOn is a [CDK](https://aws.amazon.com/cdk/) construct that makes it easy for customers to add Gmaestro to their Amazon EKS clusters.

gMaestro is a Kubernetes cost optimization solution that helps companies reduce spending on unutilized resources by up to 60%.
With gMaestro, you gain full visibility into K8s clusters, seamlessly interact with HPA scaling policies, and achieve your cost-performance goals by applying custom rightsizing recommendations based on actual usage in production.
1. **Install gMaestro** - As a single pod on your cluster with a single command line.
2. **Multi-cluster visibility** - Gain visibility into each controller, resource request, container, HPA policy, utilization, and cost.
3. **Apply custom recommendations** - gMaestro generates custom recommendations by analyzing the actual utilization of each controller.

## Prerequisite 
To use gMaestro, first you need to:
1. [Sign up](https://app.granulate.io/gMaestroSignup) to gMaestro platform
2. Retrieve your unique user’s token - After signing up to gMaestro it can be found in the [Deploy](https://app.granulate.io/deploy) on the left-hand menu.


## Usage

```typescript
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';

const app = new cdk.App();

const addOn = new blueprints.addons.Gmaestro({
        b64ClientId: "<client id>",
        clientName: "<client name>",
        serviceName: "<service name>",
        namespace: "<namespace>",
        grafanaMetricsAuthKey: "<grafana metrics auth key>",
        grafanaLogsAuthKey: "<grafana logs auth key>",
    });

const blueprint = blueprints.EksBlueprint.builder()
  .addOns(addOn)
  .build(app, 'my-stack-name');
```

Use the following command to validate that gMaesto installed successfully:

```bash
$ ubectl get pods --all-namespaces | grep granulate-maestro
NAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE
default       granulate-maestro-6947dc87bc-k5nfc   2/2     Running   0          11m
kube-system   aws-node-9rhgx                       1/1     Running   0          16m
kube-system   coredns-d5b9bfc4-8v8k5               1/1     Running   0          21m
kube-system   coredns-d5b9bfc4-r5sdb               1/1     Running   0          21m
kube-system   kube-proxy-js5pn                     1/1     Running   0          16m
```

After a few seconds, you will gain full visibility into your K8s cluster objects.
First rightsizing recommendations may take up to 5 minutes to load.



## `gMaestroAddOn` Required (props)
you may get the following parameters after [signup to Gmaestro](https://app.granulate.io/gMaestroSignup) and generate config file from the Deploy page

#### `namespace: string` (optional)

The namespace where gMaestro will be installed. `default` namespace is used as dafault.

#### `b64ClientId: string`

copy from the Deployment yaml the MAESTRO_CLIENT_ID value

#### `clientName: string`

copy from the ConfigMap yaml the prometheus.configs.scrape_configs.static_configs.labels.client_name value

#### `serviceName: string`

copy from the Deployment yaml the MAESTRO_SERVICE_NAME value

#### `grafanaMetricsAuthKey: string`

copy from the ConfigMap yaml the prometheus.configs.remote_write.basic_auth.password value

#### `grafanaLogsAuthKey: string`

copy from the ConfigMap yaml the loki.configs.clients.basic_auth.password value

## Support

If you have any questions about Gmaestro, catch us [on Slack](https://granulatecommunity.slack.com/archives/C03RK0HN2TU)!

## License

The Gmaestro AddOn is licensed under the Apache 2.0 license.
