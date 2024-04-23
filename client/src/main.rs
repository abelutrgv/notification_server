#![allow(unused_must_use)]
#![allow(dead_code)]
#![allow(unused_variables)]
#![allow(unreachable_code)]
extern crate reqwest;
use std::process::Command;
use std::collections::HashMap;
use std::time::Duration;
use async_std::task;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    loop { 
        let map = HashMap::from([("user", "abel")]);
        let client = reqwest::Client::new();
        let request = client.get("http://localhost:8080/notification").json(&map)
            .send()
            .await
            .unwrap()
            .text()
            .await
            .unwrap();

        let parsed = json::parse(&request).unwrap();
        let notif = parsed["notification"].to_string();

        if notif == "true" {

            let data = &parsed["data"];
            let parms = Vec::from([format!("Reminder for {}", data["time"]), data["desc"].to_string(), "-u".to_string(), "critical".to_string()]);
            let command = Command::new("dunstify").
                args(&parms).spawn();

        } else {
            //do nothing
        }
        task::sleep(Duration::from_secs(30)).await;
    }
    Ok(())
}
