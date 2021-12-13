export default function Permissions(write = true, config = true) {
    return function (_, __, descriptor: PropertyDescriptor) {
        descriptor.configurable = config;
        descriptor.writable = write;
    }
}