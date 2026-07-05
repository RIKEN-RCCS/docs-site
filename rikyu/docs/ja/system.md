# システム概要

本システムは、NVIDIA GB200 NVL4を搭載した400台の計算ノード、高速ストレージ2 PB（SSD）と大容量ストレージ10 PB（HDD）からなる共用ストレージ、それらを高速に結合するInfiniBand XDRネットワークから構成されます。さらに学術情報ネットワークSINET6を利用して、400 Gbpsでインターネットに接続しています。

## 計算ノードの性能

| 項目 | 値 |
|------|------|
| CPU/GPUモデル | NVIDIA GB200 NVL4 (Grace CPU &times; 2、B200 GPU &times; 4) |
| GPU理論性能 (FP64) | 160.4 TFLOPS (40.1 TFLOPS &times; 4 GPU) |
| GPU理論性能 (FP8) | 38.84 PFLOPS (9.712 PFLOPS &times; 4 GPU) |
| CPUメモリ性能 | LPDDR5X、960 GiB、768 GB/s (480 GiB、384 GB/s &times; 2 CPU) |
| GPUメモリ性能 | HBM3e、692.8 GiB、31.6 TB/s (173.2 GiB、7.9 TB/s &times; 4 GPU) |
| GPU-GPU間バンド幅 (双方向) | NVLink、600 GB/s (300 GB/s &times; 2 (双方向)) |
| CPU-GPU間バンド幅 (双方向) | NVLink-C2C、450 GB/s (225 GB/s &times; 2 (双方向)) |
| CPU-CPU間バンド幅 (双方向) | CLink、300 GB/s (150 GB/s &times; 2 (双方向)) |
| ネットワーク | InfiniBand XDR、800 Gbps &times; 4 |
| ローカルストレージ | Kioxia XD7P NVMe SSD 7.68 TB, Bandwidth: Read 7.2 GB/s, Write 4.8 GB/s, IOPS (4 KB): Read 1,550 K, Write 200 K |

CPU/GPU間の接続およびバンド幅の詳細は下図を参照してください。

![Compute node bandwidth](../img/bandwidth.png){ width="550" }

## システム全体性能

| 項目 | 値 |
|------|------|
| 計算ノード数 | 400ノード |
| GPU理論性能（FP64） | 64.160 PFLOPS (160.4 TFLOPS &times; 400ノード) |
| GPU理論性能（FP8）| 15.539 EFLOPS (38.84 PFLOPS &times; 400ノード) |
| GPUメモリ性能 | 270.625 TiB、12.640 PB/s (692.8 GiB、31.60 TB/s &times; 400ノード) |
| CPUメモリ性能 | 375 TiB、307.2 TB/s (960 GiB、768 GB/s &times; 400ノード) |
| 共用ストレージ | 高速ストレージ 2 PB（SSD）、大容量ストレージ 10 PB（HDD） |

## ネットワークトポロジ

6台のSpineスイッチと17台のLeafスイッチから構成される2層構造のFat Treeです。17台中16台のLeafスイッチは24台の計算ノードと接続されており、残り1台のLeafスイッチは16台の計算ノードと接続されています（16 &times; 24ノード + 1 &times; 16ノード = 400ノード）。同一Leafスイッチ配下の計算ノード間通信は高速ですが、Spineスイッチをまたぐ通信では、通信経路や同時に発生する通信量によって性能がやや低下する場合があります。

![Network topology](../img/network.png){ width="700" }

<!-- 計算ノード全体のバイセクションバンド幅は326.4 Tbpsです（Spineスイッチのダウンリンク本数48ポート &times; 17台 &times; 800 Gbps / 2）。一方、計算ノードのインジェクションバンド幅の合計は1,280 Tbpsです（400ノード &times; 800 Gbps &times; 4）。したがって、バイセクションバンド幅はインジェクションバンド幅合計の25.5%に相当します（326.4 / 1,280 = 0.255）。 -->
