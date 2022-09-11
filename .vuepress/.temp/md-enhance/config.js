import { defineClientConfig } from "@vuepress/client";
    import { defineAsyncComponent } from "vue";
import ChartJS from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/ChartJS";
import ECharts from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/ECharts";
import CodeDemo from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo";
import CodeTabs from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeTabs";
import FlowChart from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/FlowChart";
import Mermaid from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/Mermaid";
import Presentation from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/Presentation";
import "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/styles/container/index.scss";
import "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/styles/footnote.scss";
import "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/styles/image-mark.scss";
import Tabs from "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/components/Tabs";
import "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tasklist.scss";
import "/Users/chenrenhuan/own/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tex.scss";


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("ChartJS", ChartJS);
    app.component("ECharts", ECharts);
    app.component("CodeDemo", CodeDemo);
    app.component("CodeTabs", CodeTabs);
    app.component("FlowChart", FlowChart);
    app.component("Mermaid", Mermaid);
    app.component("Presentation", Presentation);
    app.component("Tabs", Tabs);
    
  }
});