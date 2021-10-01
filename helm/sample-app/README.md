# Patroni Helm Chart

## Installing the Chart

To install the chart with the release name `sample-app`:

```bash
$ helm install sample-app . -n <namespace> -f values.yaml -f values.secret.yaml
```

To uninstall the chart

```bash
$ helm uninstall sample-app -n <namespace>
```
