import { StepTypeEnum, WorkflowCreationSourceEnum } from '@novu/shared';
import { WorkflowTemplate } from '../types';


export const signUpMagicLinkTemplate: WorkflowTemplate = {
  id: "sign-up-magic-link",
  name: "Sign-Up Magic Link",
  description: "Sending a magic link to a user to sign up",
  category: "authentication",
  isPopular: false,
  workflowDefinition: {
    name: "Sign-Up Magic Link",
    description: "Sending a magic link to a user to sign up",
    workflowId: "sign-up-magic-link",
    steps: [
      {
        name: "Email Step",
        type: StepTypeEnum.EMAIL,
        controlValues: {
          body: "{\"type\":\"doc\",\"content\":[{\"type\":\"section\",\"attrs\":{\"borderRadius\":0,\"backgroundColor\":\"\",\"align\":\"left\",\"borderWidth\":0,\"borderColor\":\"\",\"paddingTop\":0,\"paddingRight\":0,\"paddingBottom\":0,\"paddingLeft\":0,\"marginTop\":0,\"marginRight\":0,\"marginBottom\":0,\"marginLeft\":0,\"showIfKey\":null},\"content\":[{\"type\":\"image\",\"attrs\":{\"src\":\"https://github.com/iampearceman/Design-assets/blob/main/emails/Colored%20Header%20-%20Email%20Header.png?raw=true\",\"alt\":null,\"title\":null,\"width\":\"654\",\"height\":\"65.4\",\"alignment\":\"center\",\"externalLink\":null,\"isExternalLinkVariable\":false,\"isSrcVariable\":false,\"showIfKey\":null}},{\"type\":\"spacer\",\"attrs\":{\"height\":16,\"showIfKey\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://github.com/iampearceman/Design-assets/blob/main/Acme%20Company%20Logo%20(Color).png?raw=true\",\"alt\":null,\"title\":null,\"width\":\"200\",\"height\":\"41\",\"alignment\":\"left\",\"externalLink\":null,\"isExternalLinkVariable\":false,\"isSrcVariable\":false,\"showIfKey\":null}},{\"type\":\"spacer\",\"attrs\":{\"height\":16,\"showIfKey\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://github.com/iampearceman/Design-assets/blob/main/emails/magic-link-v2%20-%20Email%20Header.png?raw=true\",\"alt\":null,\"title\":null,\"width\":\"500\",\"height\":\"200\",\"alignment\":\"center\",\"externalLink\":null,\"isExternalLinkVariable\":false,\"isSrcVariable\":false,\"showIfKey\":null}},{\"type\":\"spacer\",\"attrs\":{\"height\":16,\"showIfKey\":null}},{\"type\":\"spacer\",\"attrs\":{\"height\":16,\"showIfKey\":null}},{\"type\":\"heading\",\"attrs\":{\"textAlign\":\"center\",\"level\":2,\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(0, 0, 0)\"}},{\"type\":\"bold\"}],\"text\":\"Sign up to \"},{\"type\":\"text\",\"text\":\"Acme\"}]},{\"type\":\"spacer\",\"attrs\":{\"height\":32,\"showIfKey\":null}},{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\",\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"text\":\"Click the button below to sign up to \"},{\"type\":\"variable\",\"attrs\":{\"id\":\"payload.data.app.name\",\"label\":null,\"fallback\":null,\"required\":true}},{\"type\":\"text\",\"text\":\".\"}]},{\"type\":\"spacer\",\"attrs\":{\"height\":32,\"showIfKey\":null}},{\"type\":\"button\",\"attrs\":{\"text\":\"Sign In\",\"isTextVariable\":false,\"url\":\"payload.data.magic_link\",\"isUrlVariable\":true,\"alignment\":\"center\",\"variant\":\"filled\",\"borderRadius\":\"smooth\",\"buttonColor\":\"#0abd9f\",\"textColor\":\"#ffffff\",\"showIfKey\":null,\"paddingTop\":10,\"paddingRight\":32,\"paddingBottom\":10,\"paddingLeft\":32}},{\"type\":\"spacer\",\"attrs\":{\"height\":8,\"showIfKey\":null}},{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"center\",\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"#a0a0a0\"}}],\"text\":\"This link will expire in \"},{\"type\":\"variable\",\"attrs\":{\"id\":\"payload.data.ttl_minutes\",\"label\":null,\"fallback\":null,\"required\":true},\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"#a0a0a0\"}}]},{\"type\":\"text\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"#a0a0a0\"}}],\"text\":\" minutes.\"}]},{\"type\":\"spacer\",\"attrs\":{\"height\":32,\"showIfKey\":null}},{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\",\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"text\":\"If the button doesn’t work, you can \"},{\"type\":\"text\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"payload.data.magic_link\",\"target\":\"_blank\",\"rel\":\"noopener\",\"class\":\"mly-no-underline\",\"isUrlVariable\":true}},{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(10, 189, 159)\"}},{\"type\":\"bold\"},{\"type\":\"underline\"}],\"text\":\"click here\"},{\"type\":\"text\",\"text\":\" to sign in manually.\"}]},{\"type\":\"spacer\",\"attrs\":{\"height\":32,\"showIfKey\":null}},{\"type\":\"section\",\"attrs\":{\"borderRadius\":6,\"backgroundColor\":\"#f7f7f7\",\"align\":\"left\",\"borderWidth\":0,\"borderColor\":\"#e2e2e2\",\"paddingTop\":32,\"paddingRight\":32,\"paddingBottom\":32,\"paddingLeft\":32,\"marginTop\":0,\"marginRight\":0,\"marginBottom\":0,\"marginLeft\":0,\"showIfKey\":null},\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\",\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"bold\"}],\"text\":\"Didn't request this?\"},{\"type\":\"text\",\"text\":\" \"},{\"type\":\"hardBreak\"},{\"type\":\"text\",\"text\":\"This sign-in link was requested by \"},{\"type\":\"variable\",\"attrs\":{\"id\":\"payload.data.requested_by\",\"label\":null,\"fallback\":null,\"required\":false}},{\"type\":\"text\",\"text\":\" from \"},{\"type\":\"variable\",\"attrs\":{\"id\":\"payload.data.requested_from\",\"label\":null,\"fallback\":null,\"required\":false}},{\"type\":\"text\",\"text\":\" at \"},{\"type\":\"variable\",\"attrs\":{\"id\":\"payload.data.requested_at\",\"label\":null,\"fallback\":null,\"required\":false}},{\"type\":\"text\",\"text\":\". If you didn't initiate this request, you can safely ignore this email.\"}]}]},{\"type\":\"spacer\",\"attrs\":{\"height\":32,\"showIfKey\":null}},{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\",\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(34, 45, 56)\"}}],\"text\":\"Stay productive, \"},{\"type\":\"hardBreak\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(34, 45, 56)\"}}]},{\"type\":\"text\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(34, 45, 56)\"}}],\"text\":\"Acme Inc.\"}]},{\"type\":\"image\",\"attrs\":{\"src\":\"https://github.com/novuhq/blog/blob/main/media-assets/yelp-footer.png?raw=true\",\"alt\":null,\"title\":null,\"width\":\"654\",\"height\":\"65.19938650306749\",\"alignment\":\"center\",\"externalLink\":null,\"isExternalLinkVariable\":false,\"isSrcVariable\":false,\"showIfKey\":null}},{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\",\"showIfKey\":null},\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(34, 45, 56)\"}}],\"text\":\"© 2025 | Acme Inc., 350 Mission Street, San Francisco, CA 94105, U.S.A. | \"},{\"type\":\"text\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"http://www.yelp.com\",\"target\":\"_blank\",\"rel\":\"noopener noreferrer nofollow\",\"class\":\"mly-no-underline\",\"isUrlVariable\":false}},{\"type\":\"textStyle\",\"attrs\":{\"color\":\"rgb(10, 189, 159)\"}}],\"text\":\"www.acme.com\"}]},{\"type\":\"spacer\",\"attrs\":{\"height\":16,\"showIfKey\":null}}]},{\"type\":\"image\",\"attrs\":{\"src\":\"https://github.com/iampearceman/Design-assets/blob/main/emails/Colored%20Footer%20-%20Email%20Footer.png?raw=true\",\"alt\":null,\"title\":null,\"width\":\"654\",\"height\":\"65.4\",\"alignment\":\"center\",\"externalLink\":null,\"isExternalLinkVariable\":false,\"isSrcVariable\":false,\"showIfKey\":null}},{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\",\"showIfKey\":null}}]}",
          subject: "Your sign up link to {{payload.data.app.name}}"
        }
      }
    ],
    tags: [],
    active: true,
    __source: WorkflowCreationSourceEnum.TEMPLATE_STORE,
  },
};
