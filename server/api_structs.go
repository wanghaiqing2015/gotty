package server

type ApiResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
	Message string `json:"message"`
}

type KubeConfigRequest struct {
	Alias      string `json:"alias"`
	KubeConfig string `json:"kubeConfig"`
}

type KubeTokenRequest struct {
	Alias     string `json:"alias"`
	ApiServer string `json:"apiServer"`
	Token     string `json:"token"`
}
