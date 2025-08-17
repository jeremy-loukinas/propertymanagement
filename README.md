# PropertyOps — Full Bundle (v0.5)

Same as v0.4 plus small usability tweaks (version bump, docs).

## Fresh install (Ubuntu 24.04)
```bash
unzip propertyops_full_0.5.zip -d ~/propertyops
cd ~/propertyops/propertyops_full_0_5
bash setup_ubuntu24.sh
```

When done:
- UI:  http://<server-ip>:3030
- API: http://<server-ip>:8080/health

Default admin (change in `.env`): `admin@example.com` / `ChangeMe123!`

## Common commands
```bash
cd ~/propertyops/propertyops_full_0_5
sudo docker compose up -d     # start or restart
bash status.sh                # status + logs
bash open_ports.sh            # open 3030/8080 in UFW
bash reset_stack.sh           # ⚠ wipes DB & MinIO
```
