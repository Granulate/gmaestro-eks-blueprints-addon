import {Construct} from 'constructs';
import {ClusterInfo , Values, HelmAddOn, HelmAddOnProps, HelmAddOnUserProps, MetricsServerAddOn} from "@aws-quickstart/eks-blueprints";
import {createNamespace, dependable, getSecretValue, setPath} from "@aws-quickstart/eks-blueprints/dist/utils";

/**
 * Configuration options for add-on.
 */
export interface GmaestroAddOnProps extends HelmAddOnUserProps {
    /**
     * Namespace where add-on will be deployed.
     * @default default
     */
    namespace?: string;

    /**
     * client id secret name as defined in AWS Secrets Manager (plaintext).
     */
    clientIdSecretName: string;

    /**
     * plain text cluster name.
     */
    clusterName: string;
}

/**
 * Defaults options for the add-on
 */
const defaultProps: HelmAddOnProps = {
    name: "gmaestro-addon",
    namespace: "default",
    version: '1.0.0-latest',
    chart: "gmaestro",
    release: "gmaestro",
    repository: "https://granulate.github.io/gmaestro-helm"
};


export class GmaestroAddOn extends HelmAddOn {

    readonly options: GmaestroAddOnProps;

    constructor(props?: GmaestroAddOnProps) {
        super({...defaultProps, ...props});
        this.options = this.props as GmaestroAddOnProps;
        if (!this.options.clientIdSecretName || !this.options.clusterName) {
            throw new Error(`clientIdSecretName and clusterName are Gmaestro addon required fields.`);
        }
    }

    @dependable(MetricsServerAddOn.name)
    async deploy(clusterInfo: ClusterInfo): Promise<Construct> {
        let values: Values = await populateValues(this.options, clusterInfo.cluster.stack.region);
        if (this.options.namespace) {
            const namespace = createNamespace(this.options.namespace!, clusterInfo.cluster, true);
            const chart = this.addHelmChart(clusterInfo, values);
            chart.node.addDependency(namespace);
            return Promise.resolve(chart);
        } else {
            //Namespace is already created
            const chart = this.addHelmChart(clusterInfo, values);
            return Promise.resolve(chart);
        }
    }
}

/**
 * populateValues populates the appropriate values used to customize the Helm chart
 * @param helmOptions User provided values to customize the chart
 * @param region Region of the stack
 */
async function populateValues(helmOptions: GmaestroAddOnProps, region: string): Promise<Values> {
    const values = helmOptions.values ?? {};

    setPath(values, "namespace", helmOptions.namespace);
    const clientIdSecretValue = await getSecretValue(helmOptions.clientIdSecretName!, region);
    setPath(values, "b64ClientId", clientIdSecretValue);
    setPath(values, "clusterName", helmOptions.clusterName);

    return values;
}
