# loxone-influx

This script listens for events on Loxone's websocket (WS) API and adds event data to Influx based on the config.

The script is based on the script at: https://github.com/raintonr/loxone-stats-influx

## Usage

You can run the script directly, through node or install the scirpt as a Docker container.

### Running through node

- Update `default.json` in the `config` folder with:
  - Loxone IP address
  - Loxone username
  - Influx IP address
  - Influx database
  - Your environment's UUID's
- Create `local.json` in the `config` folder with:
  - Loxone password
- run using `node loxone-ws-influx.js` or create a service from it using `service.js`.

The file `local.json` is in `.gitignore` so it won't be added to source control.

### Running through Docker

- Update `default.json` in the `config` folder with:
  - Loxone IP address
  - Loxone username
  - Influx IP address
  - Influx database
  - Your environment's UUID's
- Create `local.json` in the `config` folder with:
  - Loxone password
- Build the container using `dockerfile`.
- Start the container
  - make sure to add the `TZ` environmental variable with the proper timezone
  - make sure to map the `config` into the container under `/app/config`, eg:

    ```docker
    docker run -d \
        --name loxone-influx \
        -v <path to config on host>/config:/app/config \
        -e TZ="Europe/London" \
        --restart=unless-stopped \
        loxone-influx
    ```

## Configuration

UUID's can be easily obtained by opening your `*.Loxone` file and searching for the building block name you are interested in. 

>NOTE: The Loxone WS API will only emit change updates for items that are configured as "Use" in the "User interface" section of the block's Loxone config.
> To avoid clutter in the Loxone native mobile app, I am using a dedicated user for this script, so items that I need in Influx but don't want in the mobile app are assigned in Loxone Config to this user only.


The configuration items under the `uuids` node need to have the following format:

```json
"uuids" : {
    "uuid-of-loxone-item": {
        "measurement" : "influx measurement name",
        "tags": {
            "any": "tag",
            "tag2": "value2"
        }
    }
}
```

## DevOps flow using Docker

I am using an Azure Container Registry (ACR) to host my images. The following ACR task watches commits in this github repository, builds the docker image, and pushes the new image to the registry.

I am running [watchtower](https://containrrr.github.io/watchtower/) to make sure my container is using the latest image available in ACR.

### ACR task

```sh
az acr task create \
     --registry andrasg \
     --name loxone-influx \
     --image loxone-influx:latest \
     --context https://github.com/andrasg/loxone-influx.git \
     --file dockerfile \
     --git-access-token <PAT> \
     --base-image-trigger-enabled false \
     --platform linux/arm/v7
```
