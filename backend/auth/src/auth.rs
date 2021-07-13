use tonic::{Request, Response, Status};

use crate::proto::auth::{AuthRequest, AuthResponse};
use crate::proto::auth::auth_server::Auth;

#[derive(Debug, Default)]
pub struct AuthService;

#[tonic::async_trait]
impl Auth for AuthService {
    async fn is_allowed(&self, _request: Request<AuthRequest>) -> Result<Response<AuthResponse>, Status> {
        let resp = AuthResponse {
            allowed: true,
        };

        log::info!("Got a request!");

        Ok(Response::new(resp))
    }
}
