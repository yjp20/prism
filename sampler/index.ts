import { GeneratorsRepository } from "./GeneratorsRepository";
import { DefaultObjectGenerator } from "./generators";
import { OpenApiSampler } from "./OpenApiSampler";

const generatorsRepository = new GeneratorsRepository();
generatorsRepository.setGenerator('object', '', new DefaultObjectGenerator(generatorsRepository));
const openApiSampler = new OpenApiSampler(generatorsRepository);
openApiSampler.sample(null);