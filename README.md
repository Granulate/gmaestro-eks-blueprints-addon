# Gmaestro AddOn for Amazon EKS Blueprints

This repository contains the source code for the Gmaestro AddOn for [Amazon EKS Blueprints](https://aws-quickstart.github.io/cdk-eks-blueprints/). This AddOn is a [CDK](https://aws.amazon.com/cdk/) construct that makes it easy for customers to add Gmaestro to their Amazon EKS clusters.

[Amazon EKS Blueprints](https://aws-quickstart.github.io/cdk-eks-blueprints/) is a framework that allows customers to create internal development platforms. It abstracts the complexities of cloud infrastructure from developers, and allows them to deploy workloads with ease

gMaestro reduces costs and manual R&D efforts by enabling dynamic scaling, complementing HPA and rightsizing workloads and nodes - Reduce your Kubernetes costs by up to 60%. see the [product and technical docs](https://granulate.io/gmaestro/).

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

To validate that Gmaestro add-on is running ensure that the add-on deployment `granulate-maestro` in `RUNNING` state:

```bash
$ kubectl get pods -A
NAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE
default       granulate-maestro-6947dc87bc-k5nfc   2/2     Running   0          11m
kube-system   aws-node-9rhgx                       1/1     Running   0          16m
kube-system   coredns-d5b9bfc4-8v8k5               1/1     Running   0          21m
kube-system   coredns-d5b9bfc4-r5sdb               1/1     Running   0          21m
kube-system   kube-proxy-js5pn                     1/1     Running   0          16m
```

Note that the agent is created in provided namespace (defaults to `default`).

Once deployed, it allows us to give you resource recommandations to optimize your cluster.


## `GmaestroAddOn` Required (props)
you may get the following parameters after [signup to Gmaestro](https://app.granulate.io/gMaestroSignup) and generate config file from the Deploy page

#### `namespace: string` (optional)

The namespace where Gmaestro will be installed. Defaults to `default`.

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
