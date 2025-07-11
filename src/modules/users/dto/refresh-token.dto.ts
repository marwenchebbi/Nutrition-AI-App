import { IsString } from "class-validator";

export class RfreshTokenDTO {
    @IsString()
    token : string
}