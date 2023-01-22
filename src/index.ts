import {Construct} from 'constructs';
import {ClusterInfo , Values, HelmAddOn, HelmAddOnProps, HelmAddOnUserProps} from "@aws-quickstart/eks-blueprints";
import {createNamespace, getSecretValue, setPath} from "@aws-quickstart/eks-blueprints/dist/utils";

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
     * granulate base 64 id.
     */
    b64ClientId: string;

    /**
     * plain text client name.
     */
    clientName: string;

    /**
     * plain text cluster name.
     */
    clusterName: string;

    /**
     * grafana metrics secret name as defined in AWS Secrets Manager (plaintext).
     * This allows us to store the gmaestro metrics in our grafana account.
     * Note: at present, change of password may require to rerun the addon.
     */
    grafanaMetricsSecretName: string;

    /**
     * grafana logs secret name as defined in AWS Secrets Manager (plaintext).
     * This allows us to store the gmaestro logs in our grafana account.
     * Note: at present, change of password may require to rerun the addon.
     */
    grafanaLogsSecretName: string;
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
        if (!this.options.b64ClientId || !this.options.clientName || !this.options.clusterName || !this.options.grafanaMetricsSecretName || !this.options.grafanaLogsSecretName) {
            throw new Error(`b64ClientId, clientName, clusterName, grafanaMetricsSecretName, grafanaLogsSecretName are Gmaestro addon required fields. 
            Please copy those values form the gmaestro deployment Yaml file (Signup to gmaestro before and generate yaml from the Deploy page).`);
        }
    }

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
    setPath(values, "b64ClientId", helmOptions.b64ClientId);
    setPath(values, "clientName", helmOptions.clientName);
    setPath(values, "clusterName", helmOptions.clusterName);
    const grafanaMetricsSecretValue = await getSecretValue(helmOptions.grafanaMetricsSecretName!, region);
    const grafanaLogsSecretValue = await getSecretValue(helmOptions.grafanaLogsSecretName!, region);
    setPath(values, "secrets.grafanaMetricsAuthKey", grafanaMetricsSecretValue);
    setPath(values, "secrets.grafanaLogsAuthKey", grafanaLogsSecretValue);

    return values;
}