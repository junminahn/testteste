{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "..name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "..fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "..chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{/*
Create data url
*/}}
{{- define "..databaseurl" -}}
{{- printf "host=%s port=%s dbname=%s user=%s password=%s sslmode=require" .Values.postgresql.host .Values.postgresql.port .Values.postgresql.database .Values.postgresql.username .Values.postgresql.password -}}
{{- end -}}

{{/*
Create GitHub docker config
{
  "auths": {
    "%s": {
      "username": "%s",
      "password": "%s",
      "auth": "%s"
    }
  }
}
*/}}
{{- define "ghdockerconfigjson" }}
{{- if .Values.docker.github.enabled -}}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\", \"auth\":\"%s\"}}}" .Values.docker.github.registry .Values.docker.github.username .Values.docker.github.password (printf "%s:%s" .Values.docker.github.username .Values.docker.github.password | b64enc) | b64enc }}
{{- end }}
{{- end }}
