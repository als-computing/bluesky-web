# Tiled Configuration
This folder contains config files to be used to start Tiled servers. A config file allows for some additional customization that is not available via command line arguments.

[Tiled Documentation](https://blueskyproject.io/tiled/)

```bash
#need to install tiled?
pip install tiled
```

## Starting Tiled with a config file:
```
tiled serve config /path/to/repo/bluesky-web/tiled/myConfig.yml
```

If your folder just has one `config.yml` you can call this as
```
tiled serve config /path/to/your/folder
```

## Environment variables
To prevent Tiled from auto generating a new api key every time it runs, we pass in an env variable during initialization of the server via the config file.

Generate a valid api key
```
openssl rand -hex 32
```

Then save it into your .bashrc or similar
```
export TILED_SINGLE_USER_API_KEY="your generated key goes here"
```

It will be loaded in the config file:
```yml
authentication:
  single_user_api_key: ${TILED_SINGLE_USER_API_KEY} #load from env var
  allow_anonymous_access: true
```
Having this as an environment variable will also help tiled services (tiled_writer) pick it up automatically and make connecting simpler.

## Database requirements
In the sample config file, we are using sqlite for both the OLTP database and the OLAP database, but postgress is another option for more horizontally scalable systems. It is also a good idea to make paths absolute.

```yml
trees:
  - path: /
    tree: catalog
    args:
      uri: "sqlite:////Users/seij/Repos/postman-demo/tiled/catalog.db" #OLTP for metadata
      writable_storage:
        - "/Users/seij/Repos/postman-demo/tiled/data" #file system storage               
        - "sqlite:////Users/seij/Repos/postman-demo/tiled/tabular.db" #OLAP for appendable tabular data      
      readable_storage:
        - "/Users/seij/Repos/postman-demo/tiled/data"
      init_if_not_exists: true #If you didn't create the .db files, this flag will do it for you on startup
```

## Connecting Queue Server Run Engine to Tiled
Using [Tiled Writer](https://blueskyproject.io/bluesky/main/tiled-writer.html), we can send relevant information from plans going through the Run Engine into a Tiled server. This occurs 'live' as soon as individual run documents are processed through the callback.

To have the Run Engine within the Queue Server write to Tiled, configure your `00_base.py` file that's passed into the Queue Server during startup.


```python
#/path/to/startup/00_base.py
from bluesky import RunEngine

RE = RunEngine({})

from bluesky.callbacks.tiled_writer import TiledWriter
from tiled.server import SimpleTiledServer
from tiled.client import from_uri

#load the Tiled api key from env var
import os
api_key = os.getenv("TILED_SINGLE_USER_API_KEY")
if not api_key:
    raise ValueError("TILED_SINGLE_USER_API_KEY environment variable is not set.")

# Initialize the Tiled server and client
tiled_client = from_uri("http://127.0.0.1:8000")
tw = TiledWriter(tiled_client)
RE.subscribe(tw)
```

For this custom RE configuration to get into the Queue Server, make sure to call the `--keep-re` flag when starting up the Queue Server.

```bash
#starting up the queue server while keeping the Run Engine configuration
start-re-manager --zmq-publish-console ON --startup-dir /path/to/startup --keep-re
```