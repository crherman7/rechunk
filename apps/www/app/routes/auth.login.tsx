import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {animate, motion} from 'framer-motion';
import {useEffect} from 'react';

import {Header} from '~/components/Header';
import {Button} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {Checkbox} from '~/components/ui/checkbox';
import {GridPattern} from '~/components/ui/grid-pattern';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {Muted} from '~/components/ui/text';
import {getVerifiedProjectId} from '~/models/project.server';
import {createProjectIdSession, getProjectId} from '~/session.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const userId = await getProjectId(request);
  if (userId) return redirect('/chunks');

  return json({});
};

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const project = String(formData.get('project'));
  const writeKey = String(formData.get('writeKey'));
  const remember = String(formData.get('remember'));

  const projectId = await getVerifiedProjectId(project, writeKey);

  if (!projectId)
    return json({
      error:
        'Authentication failed. Invalid Project ID or Write Key, please verify your credentials and try again.',
    });

  return createProjectIdSession({
    remember: remember === 'on',
    request,
    projectId,
  });
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    animate('.animate-opacity', {opacity: 1});
  }, []);

  return (
    <div className="flex h-screen flex-col justify-between">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="-z-10 [mask-image:radial-gradient(750px_circle_at_center,white,transparent)]"
      />
      <Header />
      <div className="animate-opacity flex justify-center opacity-0">
        <Form method="post">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your project ID and write key below to manage your
                project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project ID</Label>
                <Input
                  id="text"
                  type="text"
                  name="project"
                  className="text-xs"
                  placeholder="cm12wkhur0000yseh1beq2hac"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="writeKey">Write Key</Label>
                <Input
                  id="password"
                  type="password"
                  name="writeKey"
                  required
                  className="text-xs"
                  placeholder="write-1b05d860-6100-412b-b527-bc5a9d0b2059"
                />
              </div>
              <div className="items-top flex items-center space-x-2">
                <Checkbox id="remember" name="remember" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </label>
                </div>
              </div>
              {!!actionData?.error && (
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{duration: 1}}
                  className="px-1">
                  <Muted className="text-xs text-red-500">
                    {actionData.error}
                  </Muted>
                </motion.div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
      <footer className="sticky mb-5 w-full text-center">
        <Muted className="opacity-70">© All rights reserved.</Muted>
      </footer>
    </div>
  );
}
