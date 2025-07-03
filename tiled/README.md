# Tiled Configuration
This folder contains config files to be used to start Tiled servers. A config file allows for some additional customization that is not available via command line arguments.

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