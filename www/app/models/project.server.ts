import type {Project} from '@prisma/client';

export async function createProject() {}

export async function deleteProjectById(id: Project['id']) {}

export async function deleteProjectyByName(name: Project['name']) {}

export async function getProjectById(id: Project['id']) {}

export async function getProjectByName(name: Project['name']) {}

export async function verifyLogin(
  name: Project['name'],
  writeKey: Project['writeKey'],
) {}
