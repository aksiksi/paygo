use tonic::transport::Server;

use proto::auth::auth_server::AuthServer;

mod auth;
mod proto;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();

    let addr = "127.0.0.1:5050".parse()?;
    let auth_service = auth::AuthService::default();

    Server::builder()
        .add_service(AuthServer::new(auth_service))
        .serve(addr)
        .await?;

    Ok(())
}
