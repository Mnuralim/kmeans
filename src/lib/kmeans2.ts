interface Student {
  "Nama Siswa": string;
  NIS: string;
  Kelas: number;
  SPP: number;
  [key: string]: string | number;
}

export interface Cluster {
  centroid: number[];
  points: Student[];
  label: string;
  id: number;
}

interface NormalizedStudent extends Student {
  normalizedMonth1: number;
  normalizedMonth2: number;
  normalizedMonth3: number;
  originalIndex: number;
}

export class KMeans {
  private originalData: Student[];
  private normalizedData: NormalizedStudent[];
  private k: number;
  private maxIterations: number;
  private clusters: Cluster[];
  private actualIterations: number = 0;
  private converged: boolean = false;
  private monthKeys: string[];
  private normalizationParams: {
    min: number[];
    max: number[];
  };

  constructor(
    data: Student[],
    k: number,
    monthKeys: string[],
    maxIterations: number = 100
  ) {
    this.validateInputs(data, k, monthKeys);

    this.originalData = [...data];
    this.k = k;
    this.maxIterations = maxIterations;
    this.clusters = [];
    this.actualIterations = 0;
    this.converged = false;
    this.monthKeys = monthKeys;
    this.normalizationParams = { min: [], max: [] };
    this.normalizedData = this.normalizeData();
  }

  private validateInputs(
    data: Student[],
    k: number,
    monthKeys: string[]
  ): void {
    if (!data || data.length === 0) {
      throw new Error("Data tidak boleh kosong");
    }

    if (k <= 0 || k > data.length) {
      throw new Error(`K harus antara 1 dan ${data.length}`);
    }

    if (monthKeys.length !== 3) {
      throw new Error("Harus menggunakan tepat 3 bulan");
    }

    for (const student of data) {
      for (const key of monthKeys) {
        if (!(key in student) || typeof student[key] !== "number") {
          throw new Error(
            `Data tidak valid: ${student.NIS} tidak memiliki nilai numerik untuk ${key}`
          );
        }
      }
    }
  }

  private normalizeData(): NormalizedStudent[] {
    const monthValues = this.monthKeys.map((key) =>
      this.originalData.map((d) => d[key] as number)
    );

    this.normalizationParams.min = monthValues.map((values) =>
      Math.min(...values)
    );
    this.normalizationParams.max = monthValues.map((values) =>
      Math.max(...values)
    );

    return this.originalData.map((student, index) => {
      const normalized = {
        ...student,
        originalIndex: index,
      } as NormalizedStudent;

      this.monthKeys.forEach((key, i) => {
        const value = student[key] as number;
        const range =
          this.normalizationParams.max[i] - this.normalizationParams.min[i];
        const normalizedValue =
          range === 0 ? 0 : (value - this.normalizationParams.min[i]) / range;

        if (i === 0) normalized.normalizedMonth1 = normalizedValue;
        else if (i === 1) normalized.normalizedMonth2 = normalizedValue;
        else normalized.normalizedMonth3 = normalizedValue;
      });

      return normalized;
    });
  }

  private initializeCentroids(): number[][] {
    const centroids: number[][] = [];
    const used = new Set<number>();

    const firstIdx = Math.floor(Math.random() * this.normalizedData.length);
    const firstPoint = this.normalizedData[firstIdx];
    centroids.push([
      firstPoint.normalizedMonth1,
      firstPoint.normalizedMonth2,
      firstPoint.normalizedMonth3,
    ]);
    used.add(firstIdx);

    for (let i = 1; i < this.k; i++) {
      const distances: number[] = [];
      let totalDistance = 0;

      this.normalizedData.forEach((point, idx) => {
        if (used.has(idx)) {
          distances.push(0);
          return;
        }

        const pointCoords = [
          point.normalizedMonth1,
          point.normalizedMonth2,
          point.normalizedMonth3,
        ];

        let minDistance = Infinity;
        for (const centroid of centroids) {
          const distance = this.calculateDistance(pointCoords, centroid);
          minDistance = Math.min(minDistance, distance);
        }

        const sqDistance = minDistance * minDistance;
        distances.push(sqDistance);
        totalDistance += sqDistance;
      });

      let randomVal = Math.random() * totalDistance;
      let selectedIdx = -1;

      for (let j = 0; j < distances.length; j++) {
        if (used.has(j)) continue;
        randomVal -= distances[j];
        if (randomVal <= 0) {
          selectedIdx = j;
          break;
        }
      }

      if (selectedIdx === -1) {
        const availableIndices = Array.from(
          { length: this.normalizedData.length },
          (_, i) => i
        ).filter((i) => !used.has(i));
        selectedIdx =
          availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }

      const selectedPoint = this.normalizedData[selectedIdx];
      centroids.push([
        selectedPoint.normalizedMonth1,
        selectedPoint.normalizedMonth2,
        selectedPoint.normalizedMonth3,
      ]);
      used.add(selectedIdx);
    }

    return centroids;
  }

  private calculateDistance(point1: number[], point2: number[]): number {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
      sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
  }

  private assignPointsToClusters(centroids: number[][]): Cluster[] {
    const clusters: Cluster[] = centroids.map((centroid, id) => ({
      centroid: [...centroid],
      points: [],
      label: "",
      id,
    }));

    for (const point of this.normalizedData) {
      const pointData = [
        point.normalizedMonth1,
        point.normalizedMonth2,
        point.normalizedMonth3,
      ];

      let minDistance = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < centroids.length; i++) {
        const distance = this.calculateDistance(pointData, centroids[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = i;
        }
      }

      const originalPoint = this.originalData[point.originalIndex];
      clusters[closestIdx].points.push(originalPoint);
    }

    return clusters;
  }

  private calculateNewCentroids(clusters: Cluster[]): number[][] {
    return clusters.map((cluster) => {
      if (cluster.points.length === 0) return cluster.centroid;

      const sum = [0, 0, 0];

      for (const point of cluster.points) {
        const normalizedPoint = this.normalizedData.find(
          (p) => p.NIS === point.NIS
        )!;
        sum[0] += normalizedPoint.normalizedMonth1;
        sum[1] += normalizedPoint.normalizedMonth2;
        sum[2] += normalizedPoint.normalizedMonth3;
      }

      return sum.map((val) => val / cluster.points.length);
    });
  }

  private hasConverged(
    oldCentroids: number[][],
    newCentroids: number[][],
    threshold: number = 0.0001
  ): boolean {
    for (let i = 0; i < oldCentroids.length; i++) {
      const distance = this.calculateDistance(oldCentroids[i], newCentroids[i]);
      if (distance > threshold) {
        return false;
      }
    }
    return true;
  }

  private determineClusterLabels(clusters: Cluster[]): void {
    const clusterStats = clusters.map((cluster, index) => {
      if (cluster.points.length === 0) {
        return { index, avgDelay: 0, maxDelay: 0 };
      }

      const delays = cluster.points.map((point) => {
        const month1 = point[this.monthKeys[0]] as number;
        const month2 = point[this.monthKeys[1]] as number;
        const month3 = point[this.monthKeys[2]] as number;
        return (month1 + month2 + month3) / 3;
      });

      const avgDelay =
        delays.reduce((sum, delay) => sum + delay, 0) / delays.length;
      const maxDelay = Math.max(...delays);

      return { index, avgDelay, maxDelay };
    });

    const sortedStats = [...clusterStats].sort(
      (a, b) => a.avgDelay - b.avgDelay
    );

    const labels =
      this.k === 3
        ? ["Tepat waktu", "Terlambat Ringan", "Terlambat Berat"]
        : this.generateDynamicLabels(this.k);

    sortedStats.forEach((stat, i) => {
      const labelIndex = Math.min(i, labels.length - 1);
      clusters[stat.index].label = labels[labelIndex];
    });
  }

  private generateDynamicLabels(k: number): string[] {
    const labels = [];
    const segmentSize = Math.ceil(k / 3);

    for (let i = 0; i < k; i++) {
      if (i < segmentSize) {
        labels.push(`Tepat waktu ${i + 1}`);
      } else if (i >= k - segmentSize) {
        labels.push(`Terlambat Berat ${i - k + segmentSize + 1}`);
      } else {
        labels.push(`Terlambat Ringan ${i - segmentSize + 1}`);
      }
    }

    return labels;
  }

  private denormalizeCentroid(normalizedCentroid: number[]): number[] {
    return normalizedCentroid.map((value, i) => {
      const range =
        this.normalizationParams.max[i] - this.normalizationParams.min[i];
      return range === 0
        ? this.normalizationParams.min[i]
        : value * range + this.normalizationParams.min[i];
    });
  }

  public run(): Cluster[] {
    console.log("🚀 Memulai K-Means clustering...");
    console.log(`📊 Data: ${this.originalData.length} siswa, K=${this.k}`);
    console.log(`📅 Menggunakan bulan: ${this.monthKeys.join(", ")}`);

    let centroids = this.initializeCentroids();
    this.actualIterations = 0;
    this.converged = false;

    while (this.actualIterations < this.maxIterations && !this.converged) {
      const clusters = this.assignPointsToClusters(centroids);
      const newCentroids = this.calculateNewCentroids(clusters);

      this.converged = this.hasConverged(centroids, newCentroids);
      centroids = newCentroids;
      this.actualIterations++;

      console.log(
        `Iterasi ${this.actualIterations}: ${
          this.converged ? "KONVERGEN ✅" : "Berlanjut..."
        }`
      );
    }

    this.clusters = this.assignPointsToClusters(centroids);

    this.clusters.forEach((cluster, i) => {
      cluster.centroid = this.denormalizeCentroid(centroids[i]);
    });

    this.determineClusterLabels(this.clusters);

    if (this.converged) {
      console.log(`🎯 Konvergen pada iterasi ke-${this.actualIterations}`);
    } else {
      console.log(`⏹️ Mencapai maksimum iterasi (${this.maxIterations})`);
    }

    this.logClusterSummary();
    return this.clusters;
  }

  private logClusterSummary(): void {
    console.log("\n📊 Ringkasan Hasil Clustering:");
    this.clusters.forEach((cluster, i) => {
      const avgCentroid =
        cluster.centroid.reduce((sum, val) => sum + val, 0) /
        cluster.centroid.length;
      console.log(
        `Cluster ${i + 1} (${cluster.label}): ${
          cluster.points.length
        } siswa, Avg: ${avgCentroid.toFixed(2)} hari`
      );
    });
  }

  public getClusters(): Cluster[] {
    return this.clusters;
  }

  public getActualIterations(): number {
    return this.actualIterations;
  }

  public isConverged(): boolean {
    return this.converged;
  }

  public getMonthKeys(): string[] {
    return this.monthKeys;
  }

  public calculateSSE(): number {
    let totalSSE = 0;

    for (const cluster of this.clusters) {
      for (const point of cluster.points) {
        const normalizedPoint = this.normalizedData.find(
          (p) => p.NIS === point.NIS
        )!;
        const pointData = [
          normalizedPoint.normalizedMonth1,
          normalizedPoint.normalizedMonth2,
          normalizedPoint.normalizedMonth3,
        ];

        const normalizedCentroid = [
          (cluster.centroid[0] - this.normalizationParams.min[0]) /
            (this.normalizationParams.max[0] - this.normalizationParams.min[0]),
          (cluster.centroid[1] - this.normalizationParams.min[1]) /
            (this.normalizationParams.max[1] - this.normalizationParams.min[1]),
          (cluster.centroid[2] - this.normalizationParams.min[2]) /
            (this.normalizationParams.max[2] - this.normalizationParams.min[2]),
        ];

        const distance = this.calculateDistance(pointData, normalizedCentroid);
        totalSSE += distance * distance;
      }
    }

    return totalSSE;
  }
}
