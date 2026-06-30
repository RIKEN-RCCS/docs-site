!!! warning

    このページは作りかけです。

# はじめに

スーパーコンピュータ「理究」（以下、「理究」）は、AIによる科学研究の革新を目的に[理化学研究所 計算科学研究センター](https://www.r-ccs.riken.jp)に導入されたシステムです。「理究」は、計算ノード400台にNVIDIA GB200 NVL4を搭載し、合計1,600基のNVIDIA Blackwell GPUを備えます。ノード間はNVIDIA Quantum-X800 InfiniBandで最大3.2Tbpsの高速接続を実現しており、FP64演算性能は64.160 PFLOPS以上、FP8演算性能は15.539 EFLOPS以上の性能を持ちます。

このユーザガイドでは、「理究」の技術的詳細や利用方法について説明します。

## システム概要

「理究」は、400台の計算ノード、物理容量10PBの共用ストレージ、これらを高速に結合するInfiniBandネットワークから構成されます。また、ログインノード、Open OnDemandサーバ、Slurmサーバなどを備えており、SSH接続やWebブラウザからのアクセス、バッチジョブの管理が可能です。さらに「理究」は学術情報ネットワークSINET6を利用して、400Gbpsでインターネットに接続しています。

システム全体の性能は下記の通りです。

| 項目 | 値 |
|------|------|
| ノード数 | 400 nodes |
| GPU理論性能（FP64） | 64.160 PFlops (160.4 TFlops x 400 nodes) |
| GPU理論性能（FP8）| 15.539 EFlops (38.84 PFlops x 400 nodes) |
| GPUメモリ性能 | 270.625 TiB, 12.64 PB/s (692.8 GiB, 31.6 TB/s x 400 nodes) |
| CPUメモリ性能 | 375 TiB, 307.2 TB/s (960 GiB, 768 GB/s x 400 nodes) |
| 共用ストレージ | DDN ES400X3-NDR200 x 2, 1.08 PB (30.72 TB TLC NVMe SSD x 23 x 2) |

!!! note

    共有ストレージの容量の1.08 PBは有効利用容量です。10 PBのストレージは？

計算ノードあたりの性能は下記の通りです。CPU/GPU間の接続およびバンド幅は、表の下の図も参照してください。

| 項目 | 値 |
|------|------|
| CPU/GPUモデル | NVIDIA GB200 NVL4 (Grace CPU x 2, B200 GPU x 4) |
| GPU理論性能 (FP64) | 160.4 TFlops (40.1 TFlops x 4 GPUs) |
| GPU理論性能 (FP8) | 38.84 PFlops (9.712 PFlops x 4 GPUs) |
| CPUメモリ性能 | LPDDR5X, 960 GiB, 768 GB/s (480 GiB, 384 GB/s x 2 CPUs) |
| GPUメモリ性能 | HBM3e, 692.8 GiB, 31.6 TB/s (173.2 GiB, 7.9 TB/s x 4 GPUs) |
| GPU-GPU間バンド幅 (双方向) | NVLink, 600 GB/sec (300 GB/s x 2 (Bidirectional)) |
| CPU-GPU間バンド幅 (双方向) | NVLink-C2C, 450 GB/sec (225 GB/s x 2 (Bidirectional)) |
| CPU-CPU間バンド幅 (双方向) | CLink, 300 GB/sec (150 GB/s x 2 (Bidirectional)) |
| ネットワーク | InfiniBand XDR, 800 Gbps x 4 |
| ローカルストレージ | Kioxia XD7P NVMe SSD 7.68 TB, Bandwidth: Read 7.2 GB/s, Write 4.8 GB/s, IOPS (4KB): Read 1,550K, Write 200K |

![CPU and GPU bandwidth diagram](../img/bandwidth.png){ width="600" }

## ソフトウェア環境

