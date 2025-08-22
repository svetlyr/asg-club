# asg-club

# TODO: add readme

## Docker
Remember to remove named volume after deleting container

```bash
docker volume rm asg-club_pgdata_cms
docker volume rm asg-club_pgdata_server
```
or
```bash
docker compose down -v
```
