# System Update History

Only changes that affect how you use the system are listed here (internal configuration changes and maintenance work are not included). Items marked "rolling out" take effect on each compute node as it is restarted.

## August 2026

### 2026-08-25

- **[Account]** Added information that accounts beginning with `ea`, issued during Early Access Phase 1, will be deleted on September 14, 2026.

### 2026-08-20

- **[System]** Started updating the node kernel to the 7.0 series (7.0.0-1016-nvidia-64k). Trial operation has started on some of the compute nodes first, and it will be rolled out to all nodes if no problems are found. There is no change to how you use the system.

### 2026-08-17

- **[Software]** Added the GPU video decode/encode runtime (NVDEC/NVENC) to the nodes (applied to all compute nodes).
- **[Software]** Fixed an issue where `ping` could not be run (applied to all nodes).

### 2026-08-15

- **[Software]** Fixed an issue where environment initialization (`/etc/profile.d`, the `module` command, and so on) did not run when zsh was selected as the login shell (rolling out).

### 2026-08-11

- **[Generative AI]** Expanded the KV cache capacity of `kimi-k3` by about 2.9 times. Responses are faster when a conversation with a long context is continued or resumed.
- **[Slurm]** Fixed an issue where interrupting GPU profiling (Nsight Compute) could leave the GPU clocks locked and degrade the performance of subsequent jobs. The clocks are now reset automatically when a job ends.

### 2026-08-06

- **[Software]** Added zsh to all nodes. It is available as an alternative login shell (rolling out).

### 2026-08-04

- **[Software]** Added rclone (all nodes) and FUSE (login nodes) (rolling out).

## July 2026

### 2026-07-29

- **[Generative AI]** Expanded the context length of `kimi-k2.6` to 256K tokens. Together with this, tiered KV caching has made responses much faster when a conversation with a long context is continued or resumed.

### 2026-07-28

- **[Generative AI]** Started offering the new model `kimi-k3`.

### 2026-07-18

- **[System]** Updated the kernel on all nodes to 6.17.0-1026-nvidia-64k. There is no change to how you use the system.

### 2026-07-17

- **[Portal]** The top page of the RIKYU Portal now shows a list of the projects you belong to (the correspondence between group ID and project name).

### 2026-07-16

- **[Storage]** The capacity (quota) of `/data1` can now be changed as a self-service operation from the RIKYU Portal (a reduction takes effect after it is scheduled).

### 2026-07-15

- **[Software]** Installed NVIDIA HPC SDK 26.5 under `/shared` (selectable with `module`). The default MPI settings have also been improved.

### 2026-07-13

- **[Generative AI]** Removed `glm-5.2-1m`, the model for long contexts, from the model list. Input longer than 200K tokens is routed automatically from `glm-5.2` to the long-context engine, so there is no need to choose between models.
- **[Generative AI]** Fixed an issue where sending very long input resulted in an HTTP 413 error.

### 2026-07-12

- **[Portal]** Added a path to the account security settings and a link to the support site in the RIKYU Portal.

### 2026-07-11

- **[Slurm]** If you belong to multiple projects, `-A PROJECT` (explicitly specifying the project) is now required when you submit a job. A submission without it is rejected with a message (this prevents charges from going to the wrong project; if you belong to only one project, it can still be omitted as before).

### 2026-07-10

- **[Generative AI]** Ended service for `glm-5.1` and moved to `glm-5.2`.
- **[Generative AI]** Expanded the context length of `glm-5.2` to 256K, and input longer than 200K tokens is now routed automatically to the long-context engine (up to 1M).
- **[Portal]** Added explanations of how to use it, the endpoint to connect to, and points to note on the API key creation screen.
