# Open Composer

Open Composer is an application that runs on Open OnDemand and lets you create and submit batch jobs. A batch job is a computational task that is executed non-interactively by the job scheduler and is described in a shell script. Compute resources are specified using job scheduler directives (for example, `#SBATCH --gpus=4`).

## Creating a Job Script

Select <span class="text-marker">Slurm</span> from the Open OnDemand dashboard.

<img width="800" alt="Open OnDemand" src="img/ood.png" style="border: 1px solid #000;">

When you enter values in the web form with a white background, a job script is generated in the text area at the bottom right. Note that the web form with a <span style="background: yellow;">yellow</span> background contains items that do not affect the job script. An asterisk on a web form label indicates a required item.

![Web form of Slurm](img/composer_slurm.png){ width="800" }

The items at the top right have the following meanings.

| Item            | Description                          |
| --------------- | ------------------------------------ |
| Script location | Directory where the job script is saved |
| Script name     | File name of the job script          |
| Job name        | Job name                             |

!!! note

    If you change the web form with a white background after manually editing the text area, the following warning appears. Clicking <span class="text-marker">Discard and continue</span> discards the changes you made in the text area.

    <img width="400" alt="Warning" src="img/overwrite_warning.png" style="border: 1px solid #000;">

## Submitting a Job

Click <span class="text-marker">Submit</span> at the bottom of the text area to submit the job. On success, the path of the save location and a link to the History Page are displayed. Clicking the path of the save location opens the [Open OnDemand Home Directory](ood.md#home-directory). Clicking the terminal icon next to the path opens [Open OnDemand RIKYU Shell Access](ood.md#rikyu-shell-access).

![Link to History Page](img/link_to_history.png){ width="800" }

## Viewing Job History

You can view the history of submitted jobs.

<img width="800" alt="History Page" src="img/history.png" style="border: 1px solid #000;">

* The search box at the top right lets you find a specific job by filtering the job history by conditions. Clicking the <span class="text-marker">Detail</span> button enables searching with more detailed conditions.
* Clicking &#9650; or &#9660; in the table header sorts the entire table in ascending or descending order using that column as the key. The default is descending order by Job ID.
* Clicking the link in the <span class="text-marker">Job ID</span> column displays detailed information about the job.

<img width="600" alt="Job details" src="img/job_details.png" style="border: 1px solid #000; margin-left: 30px;">

* Clicking the link in the <span class="text-marker">Application</span> column opens the page for the corresponding application.
* Clicking the link in the <span class="text-marker">Script Location</span> column opens the [Open OnDemand Home Directory](ood.md#home-directory). Clicking the terminal icon opens [Open OnDemand RIKYU Shell Access](ood.md#rikyu-shell-access).
* Clicking the link in the <span class="text-marker">Script Name</span> column displays the job script that was executed.

   <img width="300" alt="Load parameters" src="img/load_parameters.png" style="border: 1px solid #000; margin-left: 30px;">

* Clicking <span class="text-marker">Load parameters</span> opens the application page with the parameters that were used to create that job script loaded.

* Select the target jobs using the checkboxes on the left side of the table and click <span class="text-marker">Cancel Job</span> to cancel queued or running jobs.
* Clicking <span class="text-marker">Delete Info</span> removes information about completed jobs from the table.
* Selecting the checkbox at the top of the table selects all jobs displayed on that page.
