import Patcher from "./patcher";
import Webpack from "./webpack"
import {promise} from "./discord";
import {forceUpdateElement} from "@powercord/util";

export default promise.then(() => {
   /* Avatar Utility Classes */
   const Avatar = Webpack.findByProps("AnimatedAvatar");
   Patcher.after("pc-utility-classes-avatar", Avatar, "default", (_, args, res) => {
      if (args[0]?.src?.includes("/avatars")) {
         res.props["data-user-id"] = args[0].src.match(/\/(?:avatars|users)\/(\d+)/)?.[1];
      }

      return res;
   });

   Patcher.after("pc-utility-classes-animated-avatar", Avatar.AnimatedAvatar, "type", (_, args, res) => {
      return <Avatar.default {...res.props} />;
   })

   const AvatarWrapper = Webpack.findByProps([ 'wrapper', 'avatar' ])?.wrapper?.split(' ')?.[0];
   setImmediate(() => forceUpdateElement(`.${AvatarWrapper}`));
})