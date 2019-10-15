package server

type ApiResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
	Message string `json:"message"`
}

type KubeConfigRequest struct {
	Name       string `json:"name"`
	KubeConfig string `json:"kubeConfig"`
}

type KubeTokenRequest struct {
	Alias     string `json:"alias"`
	ApiServer string `json:"apiServer"`
	Token     string `json:"token"`
}
