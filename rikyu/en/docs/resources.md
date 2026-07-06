# Job Resources

Specify the number of GPUs when submitting a job. <span class="text-marker">The supported GPU counts are 1, 2, 3, 4, 8, 12, and 16</span>. The number of allocated nodes, the maximum number of CPU cores, and the maximum memory amount depend on the number of GPUs.

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th style="text-align: right;">Number of GPUs</th>
      <th>Allocated nodes</th>
      <th>Maximum CPU cores/node</th>
      <th>Maximum memory/node</th>
      <th>Maximum wall time</th>
    </tr>
    <tr>
      <td style="text-align: right;">1</td>
      <td rowspan="4">1</td>
      <td>36</td>
      <td>400 GB</td>
      <td rowspan="7">96 hours</td>
    </tr>
    <tr>
      <td style="text-align: right;">2</td>
      <td>72</td>
      <td>800 GB</td>
    </tr>
    <tr>
      <td style="text-align: right;">3</td>
      <td>108</td>
      <td>1,200 GB</td>
    </tr>
    <tr>
      <td style="text-align: right;">4</td>
      <td rowspan="4">144</td>
      <td rowspan="4">1,600 GB</td>
    </tr>
     <tr>
      <td style="text-align: right;">8</td>
      <td>2</td>
    </tr>
    <tr>
      <td style="text-align: right;">12</td>
      <td>3</td>
    </tr>
    <tr>
      <td style="text-align: right;">16</td>
      <td>4</td>
    </tr>
  </tbody>
</table>
</div>

!!! note

    The maximum memory amount in the table is an estimate of the combined usable GPU memory and CPU memory. GPU memory is 173.2 GiB per GPU. In GB200 NVL4, the CPU and GPU are connected through NVLink-C2C with cache coherency, so the CPU and GPU can access each other's memory. Note that CPU memory and GPU memory have different performance characteristics.
