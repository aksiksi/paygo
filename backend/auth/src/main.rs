use tonic::{transport::Server, Request, Response, Status};

use proto::auth::{AuthRequest, AuthResponse};
use proto::auth::auth_server::{Auth, AuthServer};

mod proto;

#[derive(Debug, Default)]
struct AuthService;

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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();

    let addr = "127.0.0.1:5050".parse()?;
    let auth_service = AuthService::default();

    Server::builder()
        .add_service(AuthServer::new(auth_service))
        .serve(addr)
        .await?;

    Ok(())
}
