import {Form} from '@remix-run/react';
import {ActionFunctionArgs, json} from '@remix-run/node';
import {GitHubLogoIcon, DiscordLogoIcon} from '@radix-ui/react-icons';

import {Muted} from '~/components/ui/text';
import {Button} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const project = String(formData.get('project'));
  const writeKey = String(formData.get('writeKey'));

  return json({});
};

export default function Login() {
  return (
    <div className="flex flex-col justify-between h-screen">
      <header className="border-b h-[57px] sticky top-0 flex flex-row items-center justify-between pr-4">
        <div className="flex flex-row justify-center items-center">
          <div className="border-r p-2 h-[57px] w-[56px]">
            <a href="/">
              <Button variant="outline" size="icon" aria-label="Home">
                <img className="p-[6px]" src="/logo.svg" alt="" />
              </Button>
            </a>
          </div>
          <h1 className="ml-4 text-2xl font-pixelify">ReChunk</h1>
        </div>
        <div>
          <a href="https://github.com/crherman7/rechunk">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg hover:bg-muted"
              aria-label="Settings">
              <GitHubLogoIcon className="size-5" />
            </Button>
          </a>
          <a href="https://discord.gg/xFhuxjwhss">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg hover:bg-muted"
              aria-label="Settings">
              <DiscordLogoIcon className="size-5" />
            </Button>
          </a>
        </div>
      </header>
      <div className="flex justify-center">
        <Form method="post">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your project name and write key below to manage your
                project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="text"
                  type="text"
                  name="project"
                  placeholder="savage-whiskey-blue"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="writeKey">Key</Label>
                <Input
                  id="password"
                  type="password"
                  name="writeKey"
                  required
                  placeholder="write-9bd-323e-4f74"
                />
              </div>
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
