export interface Resource {
    cpu:     CPU;
    gpu:     GPU[];
    memory:  Memory;
    storage: Storage[];
}

export interface CPU {
    total: number;
    max:   number;
    core:  Core[];
}

export interface GPU {
    index: number;
    core: number;
    d3D: number;
    decode: number;
    encode: number;
    memory: number;
    power: number;
}

export interface Core {
    index: number;
    utilization: number;
}

export interface Memory {
    available:  number;
    use:        number;
    total:      number;
    percentage: number|'NaN';
}

export interface Storage {
    name:             string;
    type:             number;
    totalStorage:     string;
    availableStorage: string;
}
