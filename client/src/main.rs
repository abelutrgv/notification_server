#![allow(unused_must_use)]
#![allow(dead_code)]
#![allow(unused_variables)]
extern crate reqwest;
//use std::process::Command;
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    
    let map = HashMap::from([("user", "abel")]);
    #[derive(serde::Deserialize)]
    #[derive(Debug)]
    struct Data {
        title: String,
        description: String,
        date: String,
        time: String,
        address: String
    }

    let client = reqwest::Client::new();
    let request = client.get("http://localhost:8080/test").json(&map)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();
//    let mut command = Command::new("dunstify");
    let parsed = json::parse(&request).unwrap();
//    command.arg("hello").spawn();
    println!("{:?}", parsed);
    println!("{:?}", parsed[0]["title"]);
    assert_eq!(parsed[0]["title"],"te le");
    Ok(())
}
