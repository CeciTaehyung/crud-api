import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) { }

    async create(createRoleDto: CreateRoleDto) {
        try {
            const role = this.roleRepository.create(createRoleDto);
            await this.roleRepository.save(role);

            return {
                ok: true,
                mesagge: "rol creado correctamente",
                estatus: 500,
            };

        } catch (error) {
            return {
                ok: false,
                mesagge: "ocurrio un error al guardar un rol",
                status: 201,
            };
        }
    }

    async findAll() {
        try {
            const roles = await this.roleRepository.find({
                where: { isActive: true },
            });
            if (roles.length > 0) {
                return { ok: true, roles, status: 200 };
            }
            return { ok: false, message: "no e encontraron roles", status: 404 };

        } catch (error) {
            return {
                ok: false,
                messager: "ocuure un error al buscar roles",
                status: 500,
            };

        }
    }
    async listPaginated({ page, limit, name }: { page: number, limit: number, name: string }) {
        try {
            const [roles, total] = await this.roleRepository.findAndCount({
                where: {
                    name: Like(`%${name}%`),
                    isActive: true,
                },
                order: { id: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });

            if (roles.length > 0) {
                let totalPag: number = total / limit;
                if (totalPag % 1 !== 0) {
                    totalPag = Math.trunc(totalPag) + 1;
                }
                const nextPag: number = page >= totalPag ? page : Number(page) + 1;
                const prevPag: number = page <= 1 ? page : page - 1;
                return {
                    ok: true,
                    roles,
                    total,
                    totalPag,
                    currentPag: Number(page),
                    nextPag,
                    prevPag,
                    status: HttpStatus.OK,
                };
            }
            return {
                ok: false,
                error: 'Not found',
                status: 404
            }
        } catch (error) {
            return {
                ok: false,
                error: error.message,
                status: error.status
            }
        }
    }

    async findOne(id: number) {
        try {
            const rol = await this.roleRepository.findOne({ where: { id } });
            if (!rol) {
                return { ok: false, message: "rol no encontrado", estatus: 404 };
            }
        } catch (error) {
            return {
                ok: false, messager: "ocurrio un error", status: 500
            };
        }
    }
    async update(id: number, updateRoleDto: UpdateRoleDto) {
        try {
            const rol = await this.roleRepository.findOne({ where: { id } });

            rol.name = updateRoleDto.name;
            await this.roleRepository.save(rol);

            return {
                ok: true,
                message: "Rol actualizado correctamente",
                status: 200,
            };
        } catch (error) {
            return { ok: false, message: "ocurrio un error", status: 500 }
        }
    }
    async remove(id: number) {
        try {
            const rol = await this.roleRepository.findOne({ where: { id } });

            rol.isActive = false;

            await this.roleRepository.save(rol);
            return {
                ok: true,
                message: "rol eliminado correctamente",
                status: 200,

            };
        } catch (error) {
            return {
                ok: false,
                message: "ocurrio un error al eliminar un rol",
                status: 500,
            };
        }
    }
}