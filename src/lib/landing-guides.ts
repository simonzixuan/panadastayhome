export interface LandingGuide {
  metaTitle: string
  metaDescription: string
  intro: string
  sections: readonly {
    title: string
    paragraphs: readonly string[]
  }[]
  relatedLinks: readonly { label: string; href: string }[]
}

export const cityGuides: Record<string, LandingGuide> = {
  "los-angeles": {
    metaTitle: "洛杉矶华人租房｜LA 公寓、整租与合租房源",
    metaDescription: "查看洛杉矶及 Irvine、Arcadia、San Gabriel 等华人常住区域的公寓、整租和合租房源，比较通勤、停车、费用与最后核实状态。",
    intro: "洛杉矶租房覆盖的范围很大，同样写着 Los Angeles 的房源，在通勤方式、生活圈和每月总费用上可能完全不同。熊猫之家将洛杉矶市区与 Irvine、Arcadia、San Gabriel、Rowland Heights 等常见华人居住区域放在同一入口，方便留学生、新移民和家庭先按工作或学校位置缩小范围，再比较房型、停车、入住时间与核实状态。",
    sections: [
      {
        title: "先按通勤方向选择区域",
        paragraphs: [
          "在 Downtown LA、Koreatown 或 USC 周边学习工作，可优先比较市中心及轨道交通沿线；前往圣盖博谷通勤，可查看 Arcadia、San Gabriel、Monterey Park 和周边城市；工作地点在橙县时，Irvine 通常比每天横跨洛杉矶更实际。不要只看地图直线距离，应使用准确地址分别测试工作日早晚高峰。",
          "有学区需求时，城市名和邮编不能代替学校边界核实。确定房源后，应以完整门牌地址向对应学区确认入学资格；页面中的区域名称只用于初步筛选。",
        ],
      },
      {
        title: "公共交通、开车和停车",
        paragraphs: [
          "LA Metro 的轨道和快速公交网络连接市中心、North Hollywood、Santa Monica、East Los Angeles、LAX 周边及其他区域，但并非每套房都适合无车生活。看房前应核对步行到车站的实际路线、换乘次数、晚间回程和最新时刻表。",
          "开车租客要把固定车位、访客停车、街道清扫和充电条件一起纳入比较。部分公寓的停车费不包含在标价中，合租或独立屋也可能限制车辆数量，因此月租不能代表完整居住成本。",
        ],
      },
      {
        title: "公寓、独立屋和合租怎么比较",
        paragraphs: [
          "公寓通常需要确认申请费、停车、储物、宠物和公共设施费用；独立屋或联排屋还要确认庭院维护、水电燃气和垃圾费由谁承担。单间、套房或后屋则应问清独立出入口、厨房卫浴、洗衣方式和公共区域。",
          "带家具、短租或学生合租房源要把家具清单、完整租期、续租、转租和室友退出规则写入书面协议。不要只根据标题中的“整租”“独立”或“拎包入住”判断实际条件。",
        ],
      },
      {
        title: "申请和付款前如何核实",
        paragraphs: [
          "常见申请材料包括身份证明、收入或资金证明、信用记录以及录取或雇佣文件。没有美国信用记录的租客可以提前询问担保人或其他替代材料，但具体标准由房东或物业决定。",
          "支付申请费、订金或押金前，应核对完整地址、出租方身份、房屋现状、书面租约和收款主体。无法现场看房时可要求实时视频展示门牌与室内；页面显示的最后核实时间只反映记录更新时间，预约前仍需再次确认是否可租。",
        ],
      },
    ],
    relatedLinks: [
      { label: "USC 附近租房", href: "/schools/usc" },
      { label: "UCLA 附近租房", href: "/schools/ucla" },
    ],
  },
  vancouver: {
    metaTitle: "温哥华华人租房｜大温公寓、整租与合租房源",
    metaDescription: "查看 Vancouver、Richmond、Burnaby、Coquitlam 与 Surrey 当前租房信息，比较 SkyTrain 通勤、房型、费用和最后核实状态。",
    intro: "温哥华华人租房通常不只比较 Vancouver 市内，还会同时查看 Richmond、Burnaby、Coquitlam 和 Surrey。不同城市在 SkyTrain 线路、到学校或工作的通勤、房型和费用结构上差异明显。本页汇总大温地区当前标记为可租的房源，并提供区域选择、申请材料和付款核验提示。",
    sections: [
      {
        title: "大温常见居住区域怎么选",
        paragraphs: [
          "Downtown、West End 和沿 Broadway 一带更适合重视市区通勤的人；Richmond 中文生活服务集中，并可连接机场与市中心；Burnaby 的 Metrotown、Brentwood 和 Lougheed 周边常见公寓；Coquitlam 与 Surrey 则可在空间、预算和通勤之间继续比较。",
          "需要前往 UBC、SFU 或固定办公地点时，应从每天的终点反推居住区域。城市之间看似相邻，但换乘、过桥和末班车会改变实际体验，最好用完整地址测试工作日路线。",
        ],
      },
      {
        title: "SkyTrain 与日常通勤",
        paragraphs: [
          "TransLink 的 Expo Line 连接 Vancouver 市中心、Burnaby、New Westminster 和 Surrey；Millennium Line 经过 Burnaby、Port Moody 与 Coquitlam；Canada Line 连接市中心、YVR 和 Richmond。靠近车站的房源仍要核对步行路线、换乘和夜间班次。",
          "不在轨道沿线时，应检查公交接驳和雨天步行条件。开车租客还要确认固定车位、访客停车、充电设施及楼宇搬入安排，不要把“近天车”当作统一标准。",
        ],
      },
      {
        title: "公寓、地下室和独立屋费用",
        paragraphs: [
          "公寓需要确认车位、储物、搬入预约、宠物和物业规定；地下室或独立套房要确认采光、独立出入口、暖气、洗衣和水电网分摊；独立屋则要问清庭院、垃圾和日常维护责任。",
          "比较预算时应把月租之外的水电、网络、停车、家具和通勤成本一并计算。房源写有一室一厅或独立套房，不代表厨房、洗衣或入口一定完全独立。",
        ],
      },
      {
        title: "申请材料与防止错误付款",
        paragraphs: [
          "房东或物业可能要求身份、工作、收入、资金、信用或推荐材料。留学生和新移民可提前准备录取、在读或雇佣文件，并先询问没有本地信用记录时接受哪些替代方案。",
          "签约前应查看准确地址和房屋状况，核对出租方、租约与收款信息是否一致。远程租房可以要求实时视频看房；任何要求绕过书面租约、拒绝展示房屋或催促立即转账的情况都应进一步核实。",
        ],
      },
    ],
    relatedLinks: [{ label: "UBC 附近租房", href: "/schools/ubc" }],
  },
  toronto: {
    metaTitle: "多伦多华人租房｜公寓、一室一厅与整租房源",
    metaDescription: "查看 Toronto、North York、Markham、Richmond Hill 与 Mississauga 当前租房信息，比较 TTC、区域通勤、房型和申请条件。",
    intro: "多伦多租房入口同时覆盖 Toronto 市内、North York、Markham、Richmond Hill 和 Mississauga，适合需要比较市中心通勤、华人生活圈与家庭住房的租客。选择时应先确认每天前往的学校或办公地点，再比较 TTC、YRT/Viva、GO Transit、开车时间以及房屋的实际费用。",
    sections: [
      {
        title: "市中心、North York 与周边城市",
        paragraphs: [
          "Downtown Toronto 适合需要前往市中心学校和办公区的人；North York 可结合地铁沿线寻找公寓；Markham 与 Richmond Hill 常见公寓、联排和家庭型住房；Mississauga 则要根据 City Centre、GO 车站或工作地点进一步筛选。",
          "同一城市内部跨度也很大。广告写着 Toronto 或 Markham 时，仍应使用完整地址核对到车站、超市、学校和工作地点的真实距离，不能只依赖区域名。",
        ],
      },
      {
        title: "TTC、区域公交与 GO 通勤",
        paragraphs: [
          "TTC 网络包含地铁、轻轨、街车和公交，市外通勤还可能使用 YRT/Viva、MiWay 或 GO Transit。选房时要检查最近站点、换乘次数、夜间班次及冬季步行路线，并按入住日期查看官方服务调整。",
          "如果开车，应比较高速公路高峰时间、固定车位和访客停车。公寓车位可能单独收费，家庭住房也可能有冬季停车或除雪责任。",
        ],
      },
      {
        title: "Condo、公寓和地下室房源",
        paragraphs: [
          "Condo 房源要确认物业搬入预约、电梯、钥匙押金、车位、储物和租客保险要求；出租公寓要查看租金包含项目；地下室或独立套房则要确认出入口、厨房、洗衣、暖气和水电分摊。",
          "一室一厅、单间和整租代表的居住条件不同。看房时应核对卧室是否有门窗、哪些空间共用、室友人数、宠物规则及家具清单，再比较总费用。",
        ],
      },
      {
        title: "申请、学校和付款核实",
        paragraphs: [
          "申请方可能要求身份、工作、收入、信用、资金或推荐材料。国际学生和新移民可以提前准备录取、在读、雇佣或资金文件，并询问担保方案。学区必须按完整门牌地址向对应教育机构确认。",
          "在支付任何款项前，应核对房屋、出租方、书面租约和收款主体。页面的可租状态及最后核实时间用于筛选，不代表房源会一直保留；预约和签约前必须再次确认。",
        ],
      },
    ],
    relatedLinks: [
      { label: "温哥华华人租房", href: "/city/vancouver" },
      { label: "全部加拿大房源", href: "/listings?country=CA" },
    ],
  },
  seattle: {
    metaTitle: "西雅图华人租房｜Seattle 公寓与中文找房指南",
    metaDescription: "查看 Seattle、Bellevue、Redmond、Kirkland、Renton 与 Bothell 当前房源，比较 Link 交通、跨湖通勤、停车和申请条件。",
    intro: "西雅图华人租房通常需要同时比较 Seattle 市内与 Bellevue、Redmond、Kirkland 等东区城市。工作地点在市中心、University District、South Lake Union 或 Eastside 时，跨湖通勤和办公室到站点的最后一段路会直接影响选择。本页汇总当前房源，并说明交通、房型、费用和签约核验重点。",
    sections: [
      {
        title: "Seattle 与 Eastside 怎么选",
        paragraphs: [
          "Seattle 市内可按 Downtown、Capitol Hill、University District、Northgate 等生活圈比较；Bellevue 和 Redmond 更适合固定在 Eastside 工作的人；Kirkland、Renton 与 Bothell 则要结合公交、开车路线和停车条件判断。",
          "远程或混合办公也应确认每周必须到办公室的天数。跨湖距离不远，但高峰拥堵、换乘和停车可能放大通勤成本，应使用准确地址分别测试公共交通与驾车方案。",
        ],
      },
      {
        title: "Link 轻轨和跨湖通勤",
        paragraphs: [
          "Sound Transit 的 1 Line 服务 Seattle 走廊并连接北部社区、市中心和机场方向；2 Line 服务 Bellevue 与 Redmond 一带。跨湖连接和接驳方式可能随工程与服务调整变化，租客应按计划入住日期查看官方路线图和服务公告。",
          "依赖公交或轻轨时，应核对步行到站距离、换乘、末班时间及周末服务。开车时还要比较固定车位、月度停车费、访客停车和充电条件。",
        ],
      },
      {
        title: "公寓、联排和独立屋的实际成本",
        paragraphs: [
          "市区公寓应确认停车、储物、宠物、公共设施和搬入费用；Eastside 的公寓或联排要核对通勤接驳和车位；独立屋则要明确水电、垃圾、庭院及维护责任。",
          "带家具或合租房源还需确认家具清单、公共区域、室友、租期和转租规则。比较房源时应使用包含固定附加费用后的月度总成本。",
        ],
      },
      {
        title: "申请和远程看房核验",
        paragraphs: [
          "申请通常涉及身份、收入、工作、信用或资金材料。刚到美国的租客可以提前询问没有本地信用历史时接受哪些证明或担保安排，避免看中房源后才开始准备。",
          "远程看房应要求实时展示门牌、房间和公共区域，并核对出租方身份、书面租约与收款账户。任何明显低于同类房源、拒绝看房或要求立即转账的情况都需要暂停付款并继续核实。",
        ],
      },
    ],
    relatedLinks: [
      { label: "温哥华华人租房", href: "/city/vancouver" },
      { label: "洛杉矶华人租房", href: "/city/los-angeles" },
    ],
  },
  "new-york": {
    metaTitle: "纽约华人租房｜NYC 公寓、合租与中文找房指南",
    metaDescription: "查看 Manhattan、Queens、Brooklyn、Flushing、Long Island City 与 Jersey City 当前房源，比较地铁通勤、费用和申请条件。",
    intro: "纽约租房需要把 Manhattan、Queens、Brooklyn、Flushing、Long Island City 与 Jersey City 放在真实通勤路线中比较。离目的地更近不一定换乘更少，标价也可能不包含经纪费、设施费或其他一次性费用。本页集中展示当前房源，并帮助学生、上班族和新移民核对区域、交通、预算与签约风险。",
    sections: [
      {
        title: "按目的地反推居住区域",
        paragraphs: [
          "前往 Midtown 或 Downtown Manhattan 的租客，可比较 Manhattan、Long Island City、Queens 与 Brooklyn 的直达路线；偏好华人生活服务时常会查看 Flushing；Jersey City 则需要把过河交通、换乘和晚间回程一并计算。",
          "纽约每个 borough 内部差异很大，同一社区不同街区到车站的距离也会改变体验。应使用完整地址测试工作日通勤，并查看夜间和周末服务，而不是只根据社区名判断。",
        ],
      },
      {
        title: "地铁、公交与跨河交通",
        paragraphs: [
          "MTA 地铁和公交覆盖纽约市主要区域，但线路可能有快慢车、施工和周末调整。签约前应核对最近入口、实际运营线路、换乘和无障碍需求，并使用官方行程工具查看计划入住时的服务。",
          "选择 Jersey City 或其他跨河区域时，要单独核对 PATH、轮渡或公交的运营和票价，不能把它们默认视为纽约地铁的一部分。晚归租客还应准备服务中断时的替代路线。",
        ],
      },
      {
        title: "房型、室友和全部费用",
        paragraphs: [
          "纽约常见选择包括电梯公寓、步梯楼、整租、单间和多人合租。看房时要确认合法卧室、采光、洗衣、电梯、暖气、空调、宠物及公共区域，并了解租约是整套共同承担还是单间分别签署。",
          "除月租和押金外，还应书面确认申请、经纪、设施、搬入及担保相关费用。不要依据“免佣”或“净有效租金”的标题做决定，应要求列出整个租期实际支付金额。",
        ],
      },
      {
        title: "材料准备与防诈骗核验",
        paragraphs: [
          "房东、物业或担保机构可能要求身份、收入、工作、信用、资金和推荐材料。学生及新移民应提前询问担保人、第三方担保或其他替代文件的要求，并确认申请费是否可退。",
          "付款前要确认准确地址、房屋现状、出租授权、租约和收款主体。无法到场时应安排实时视频或可信代表看房；未经核实不要通过不可追回的方式向陌生个人付款。",
        ],
      },
    ],
    relatedLinks: [
      { label: "多伦多华人租房", href: "/city/toronto" },
      { label: "全部纽约房源", href: "/listings?city=New%20York" },
    ],
  },
}

export const areaGuides: Record<string, LandingGuide> = {
  irvine: {
    metaTitle: "Irvine 华人租房｜尔湾公寓、独立屋最新房源",
    metaDescription: "查看 Irvine 尔湾当前可租公寓、联排屋和独立屋，比较区域、通勤、学校与最后核实时间，熊猫之家提供中文找房和看房协助。",
    intro: "Irvine 位于橙县，住宅社区、商业中心和办公园区分布较分散。找房时不能只看城市名称，还要同时考虑上班或上学地点、是否需要开车、停车条件以及租约开始时间。本页汇总当前仍标记为可租的 Irvine 房源，并把房型、价格和核实状态放在同一页面，方便留学生、新移民和华人家庭先完成第一轮比较。",
    sections: [
      {
        title: "Irvine 常见居住区域怎么选",
        paragraphs: [
          "靠近 UC Irvine 的 University Town Center、Turtle Rock 和周边社区，通常更适合需要往返校园的学生和教职人员。Irvine Spectrum、Los Olivos 和 Great Park 一带更常被在南橙县工作、需要连接 I-5 或 I-405 的租客关注。Woodbridge、Northwood、Westpark 等成熟社区生活设施较完整，但不同小区的房型、停车和物业规定差异明显。",
          "如果重视学校，不要只根据房源标题判断学区。学校边界可能随具体地址而变化，签约前应使用完整门牌地址向对应学区再次确认。页面中的学校和区域说明用于缩小范围，不替代学校或政府机构的正式信息。",
        ],
      },
      {
        title: "交通、通勤和日常生活",
        paragraphs: [
          "Irvine 的日常出行通常更依赖汽车。看房时建议把公司、学校和常去地点放进地图，分别查看工作日早晚高峰的预计时间，而不是只看直线距离。没有车的租客需要重点核实公交站、校园班车、购物距离和夜间回程方式。",
          "公寓或共管公寓还应确认停车位数量、访客停车、充电设施、垃圾和水费是否包含。独立屋或联排屋则要进一步确认庭院维护、物业规则和公共设施费用由谁承担。把这些费用加入月租后再比较，通常比只按标价排序更准确。",
        ],
      },
      {
        title: "哪些租客更适合 Irvine",
        paragraphs: [
          "Irvine 常见需求包括 UC Irvine 学生和访问学者、在橙县科技或医疗机构工作的上班族，以及希望长期稳定居住的家庭。学生通常更关注通勤、家具和租期；家庭更关注房间数量、学校、停车和社区环境；刚到美国的租客则可能需要提前准备护照、录取或雇佣证明、资金证明和担保方案。",
          "申请条件由房东或物业公司决定。没有美国信用记录不代表一定不能申请，但可能需要补充收入、存款、担保人或预付条件。提交任何押金前，应确认房源、出租方身份、书面租约和收款信息一致，不要仅凭聊天记录付款。",
        ],
      },
      {
        title: "看房和签约前检查清单",
        paragraphs: [
          "先确认准确地址、可入住日期、租期、押金、申请费和每月固定费用，再核对是否带家具、宠物规则、洗衣设备及维修责任。远程看房时可以要求实时视频展示门牌、室内和公共区域，并确认视频中的房屋与合同地址相同。",
          "熊猫之家页面展示的是用于初步筛选的信息。房源状态可能在发布后发生变化，预约或付款前仍需再次联系发布方核实。页面所示最后核实时间来自房源记录，不会因为打开页面而自动改成当天。",
        ],
      },
    ],
    relatedLinks: [
      { label: "洛杉矶华人租房", href: "/city/los-angeles" },
      { label: "Arcadia 华人租房", href: "/area/arcadia" },
      { label: "San Gabriel 华人租房", href: "/area/san-gabriel" },
      { label: "USC 附近租房", href: "/schools/usc" },
    ],
  },
  arcadia: {
    metaTitle: "Arcadia 华人租房｜阿凯迪亚公寓、独立屋房源",
    metaDescription: "查看 Arcadia 阿凯迪亚当前公寓、独立屋、整租和分租房源，按预算与入住时间比较，并获得中文房源确认和看房协助。",
    intro: "Arcadia 位于圣盖博谷，住宅街区、商业带和公共交通节点之间的生活方式差异明显。找房时应同时比较到工作或学校的实际通勤、停车、房屋维护方式和费用包含范围。本页集中展示当前标记为可租的 Arcadia 房源，并提供中文筛选和状态核实入口。",
    sections: [
      {
        title: "Arcadia 不同位置怎么选",
        paragraphs: [
          "靠近 Huntington Drive、Santa Anita Avenue 和 Arcadia A Line Station 的房源，通常更便于连接商业设施和公共交通；更深入住宅街区的独立屋或附属单元，可能更重视空间和停车。房源写着“Arcadia”时，仍应使用完整地址核对行政边界、学校归属和日常步行距离。",
        ],
      },
      {
        title: "交通与日常生活",
        paragraphs: [
          "Arcadia A Line Station 可连接洛杉矶轨道交通，市内也有 Arcadia Transit 固定线路。是否适合无车生活取决于房源到车站、公交站、超市和工作地点的实际距离；签约前应分别测试工作日通勤和晚间回程，不要只依据“近车站”的描述。",
        ],
      },
      {
        title: "申请与看房核实",
        paragraphs: [
          "公寓要确认停车、洗衣、物业费用和宠物规则；独立屋、后屋或分租房要确认独立出入、厨房卫浴、公共区域和水电网分摊。付款前核对出租方、门牌地址、书面租约和收款信息，学区需求则应凭完整地址向对应机构确认。",
        ],
      },
    ],
    relatedLinks: [
      { label: "洛杉矶华人租房", href: "/city/los-angeles" },
      { label: "San Gabriel 华人租房", href: "/area/san-gabriel" },
      { label: "Rowland Heights 租房", href: "/area/rowland-heights" },
      { label: "Irvine 华人租房", href: "/area/irvine" },
    ],
  },
  "rowland-heights": {
    metaTitle: "Rowland Heights 租房｜罗兰岗单间、整租房源",
    metaDescription: "查看 Rowland Heights 罗兰岗当前单间、套房、合租和整租房源，比较价格、房型与最后核实时间，提供中文找房协助。",
    intro: "Rowland Heights 的租房选择常见于独立屋整租、单间、套房和附属居住空间。区域范围较分散，房源之间在停车、独立出入、公共空间和通勤方式上可能差异很大。本页用于比较当前房源的基础条件，并帮助租客在联系发布方前整理需要核实的问题。",
    sections: [
      {
        title: "单间、套房和整租怎么区分",
        paragraphs: [
          "标题中的“套房”不一定代表完全独立的住宅单元。应确认是否独立出入、是否共享厨房或卫浴、洗衣方式、室友人数、访客规则和水电网计算方式。多人整租还要明确每位申请人的签约责任，以及室友变更和提前退租规则。",
        ],
      },
      {
        title: "通勤与停车条件",
        paragraphs: [
          "罗兰岗日常出行通常需要结合汽车和公交。找房时应根据工作或学校方向测试实际高峰通勤，并确认车位数量、街道停车限制和访客停车。没有车的租客要额外检查步行路线、公交换乘、购物距离及晚间回程方式。",
        ],
      },
      {
        title: "付款前的房源核实",
        paragraphs: [
          "要求看到完整门牌、室内格局和公共区域，远程看房时可安排实时视频。书面租约应写清租金、押金、租期、费用、维修责任和退租条件；遇到拒绝看房、价格明显异常或催促立即转账的情况，应暂停付款并进一步核实。",
        ],
      },
    ],
    relatedLinks: [
      { label: "洛杉矶华人租房", href: "/city/los-angeles" },
      { label: "San Gabriel 华人租房", href: "/area/san-gabriel" },
      { label: "Arcadia 华人租房", href: "/area/arcadia" },
      { label: "Irvine 华人租房", href: "/area/irvine" },
    ],
  },
  "san-gabriel": {
    metaTitle: "San Gabriel 华人租房｜圣盖博公寓、整租房源",
    metaDescription: "查看 San Gabriel 圣盖博当前公寓、独立屋、整租和合租房源，了解交通、生活圈、申请条件与最后核实时间，提供中文协助。",
    intro: "San Gabriel 位于圣盖博谷华人生活圈，中文餐饮、超市和生活服务较集中。这里既有公寓和联排住宅，也有独立屋整租或分租。找房时应先区分整套出租、独立出入套房和共享厨房的单间，再比较停车、通勤、费用包含范围及可入住日期，避免只看标题中的“整租”两个字。",
    sections: [
      {
        title: "圣盖博不同房型怎么比较",
        paragraphs: [
          "公寓通常便于控制总预算，但需要确认停车位、洗衣方式、物业规定和公共费用。独立屋空间较大，可能更适合家庭或多人合租，同时也要核实庭院维护、水电燃气和垃圾费用。后屋、车库改建或独立套房必须确认实际格局、出入口、厨房和卫浴是否独立。",
          "同样写着两室或三室的房源，居住体验可能因面积、楼层、采光和停车差异很大。建议先用房型和预算筛选，再根据完整照片、实时视频或现场看房确认，不要仅凭一张封面图决定。",
        ],
      },
      {
        title: "交通和生活圈",
        paragraphs: [
          "Valley Boulevard 及周边商业带集中了较多餐饮和生活服务，适合重视中文生活便利度的租客。需要前往 Downtown Los Angeles、Pasadena 或橙县通勤时，应分别查看工作日高峰路线，并确认是否需要多次换乘。San Gabriel 本地出行依然较依赖汽车，停车条件往往是筛选房源的重要因素。",
          "没有车的租客应核实公交线路、步行环境、购物距离和晚间回程方式。房源描述中的“近车站”或“交通方便”没有统一标准，最好用准确地址自行测量，并把每天可接受的通勤时间写入找房需求。",
        ],
      },
      {
        title: "适合家庭、上班族还是合租",
        paragraphs: [
          "家庭租客通常更关注卧室数量、学校、停车和长期租约；上班族更关注高速公路方向与通勤；合租租客需要确认公共区域使用、访客规则、室友人数和水电网分摊方式。如果多人共同签约，还应提前明确每位申请人的材料和责任。",
          "学区归属必须以完整地址向对应机构核实，不能只根据 San Gabriel 城市名判断。部分房源的邮寄城市、学区和实际行政边界并不完全一致，因此签约前需要再次确认。",
        ],
      },
      {
        title: "付款前要核实什么",
        paragraphs: [
          "确认出租方有权出租、合同地址与看房地址一致，并在书面租约中写清月租、押金、租期、费用、维修和退租规则。遇到明显低于同类房源、拒绝视频或现场看房、催促使用难以追回的方式付款时，应暂停交易并进一步核实。",
          "本页只展示当前数据库中标记为可用的房源。房东或物业可能在页面更新前完成出租，因此预约前仍需核实最新状态。熊猫之家提供中文筛选和沟通协助，但不会把尚未核实的记录描述成已经确认可租。",
        ],
      },
    ],
    relatedLinks: [
      { label: "洛杉矶华人租房", href: "/city/los-angeles" },
      { label: "Arcadia 华人租房", href: "/area/arcadia" },
      { label: "Rowland Heights 华人租房", href: "/area/rowland-heights" },
      { label: "Irvine 华人租房", href: "/area/irvine" },
    ],
  },
  richmond: {
    metaTitle: "Richmond BC 租房｜列治文公寓、独立屋房源",
    metaDescription: "查看 Richmond BC 列治文当前公寓、联排屋、独立屋和分租房源，比较价格、房型与最后核实时间，获得中文看房协助。",
    intro: "Richmond BC 的租房选择覆盖市中心公寓、联排住宅、独立屋和分租单元。沿 Canada Line 与远离轨道交通的住宅区，在通勤方式、停车和生活便利度上差异明显。本页集中比较当前可租房源，并把价格、房型与最后核实状态放在同一页面。",
    sections: [
      {
        title: "列治文不同生活圈怎么比较",
        paragraphs: [
          "Richmond City Centre、No. 3 Road 沿线和 Canada Line 车站周边更适合重视公共交通与商业设施的租客；Steveston 及其他住宅区更需要结合开车、公交和日常采购路线判断。公寓、联排屋和独立屋的停车、储物及物业规则也应一并比较。",
        ],
      },
      {
        title: "Canada Line 与通勤",
        paragraphs: [
          "Canada Line 连接列治文、机场和温哥华市区，但房源到车站的接驳距离会显著影响实际通勤。看房前应使用准确地址测试上班高峰、晚间和周末路线，并确认公交换乘、停车位和访客停车条件。",
        ],
      },
      {
        title: "租约和费用要确认什么",
        paragraphs: [
          "共管公寓要确认搬入预约、物业规则、车位和储物间是否包含；独立屋或分租房要确认水电网、供暖、庭院维护和公共区域。付款前核对出租方身份、合同地址、押金和书面租约，房源状态也应在预约前再次确认。",
        ],
      },
    ],
    relatedLinks: [
      { label: "温哥华华人租房", href: "/city/vancouver" },
      { label: "Burnaby 华人租房", href: "/area/burnaby" },
      { label: "Coquitlam 租房", href: "/area/coquitlam" },
      { label: "Surrey BC 租房", href: "/area/surrey" },
    ],
  },
  burnaby: {
    metaTitle: "Burnaby 华人租房｜本拿比公寓、合租房源",
    metaDescription: "查看 Burnaby 本拿比当前公寓、联排屋、独立屋和合租房源，按预算与入住时间筛选，并获得中文房源确认和看房协助。",
    intro: "Burnaby 连接温哥华、新西敏和高贵林，不同 SkyTrain 走廊与住宅区的通勤和房型差异较大。Metrotown、Brentwood、Lougheed 等生活圈常见公寓选择，其他区域也有独立屋、联排和分租房源。本页帮助租客按预算、交通和入住条件完成初步比较。",
    sections: [
      {
        title: "Metrotown、Brentwood 与 Lougheed 怎么选",
        paragraphs: [
          "Metrotown 靠近 Expo Line，Brentwood 和 Lougheed 一带连接 Millennium Line；选择时除了车站距离，还要比较上班或上学方向、换乘次数、楼宇费用和周边日常服务。远离车站的住宅区可能空间更大，但需要核实公交接驳和停车。",
        ],
      },
      {
        title: "公寓和独立屋的费用差异",
        paragraphs: [
          "公寓申请时要确认车位、储物、搬入费、物业预约和宠物规定；独立屋、地下室或合租房则要确认独立出入、供暖、水电网、洗衣与公共空间。把固定费用加入月租后再比较，通常比只看标价更准确。",
        ],
      },
      {
        title: "适合学生和上班族的核实重点",
        paragraphs: [
          "前往温哥华市区、SFU 或大温其他城市时，应按实际门牌测试高峰通勤。学生和新移民还要提前准备身份证明、录取或雇佣材料、资金证明和担保方案；提交押金前必须确认出租方、房屋和租约信息一致。",
        ],
      },
    ],
    relatedLinks: [
      { label: "温哥华华人租房", href: "/city/vancouver" },
      { label: "Richmond BC 租房", href: "/area/richmond" },
      { label: "Coquitlam 租房", href: "/area/coquitlam" },
      { label: "Surrey BC 租房", href: "/area/surrey" },
    ],
  },
  coquitlam: {
    metaTitle: "Coquitlam 租房｜高贵林公寓、独立屋房源",
    metaDescription: "查看 Coquitlam 高贵林当前公寓、独立屋和家庭住房，比较租金、房型与最后核实时间，熊猫之家提供中文找房协助。",
    intro: "Coquitlam 的公寓、联排屋和独立屋分布在多个生活圈，靠近 Millennium Line 的房源与更深入住宅区的房源，在通勤、空间和停车上各有取舍。本页展示当前可租记录，方便家庭、学生和上班族先比较价格、房型及核实状态。",
    sections: [
      {
        title: "Coquitlam Centre 与 Burquitlam 怎么比较",
        paragraphs: [
          "Coquitlam Central、Lincoln 和 Lafarge Lake–Douglas 一带适合需要连接 Millennium Line 与商业设施的租客；Burquitlam 靠近 Burnaby 边界，通勤方向不同。选择时应核对房源到车站的实际步行或公交距离，而不是只看区域名称。",
        ],
      },
      {
        title: "家庭住房和公寓的选择",
        paragraphs: [
          "家庭租客通常更关注卧室数量、学校、停车和长期租约；公寓租客则需要确认车位、储物、物业规则与搬入安排。学校归属可能随门牌变化，应使用完整地址向对应机构核实，不以房源标题作为依据。",
        ],
      },
      {
        title: "看房与申请材料",
        paragraphs: [
          "申请前确认可入住日期、租期、押金、费用和宠物规则，并准备身份证明、收入或资金材料。远程看房要核对门牌、室内和公共区域；付款前确认出租方身份和书面租约，页面状态也需向发布方再次核实。",
        ],
      },
    ],
    relatedLinks: [
      { label: "温哥华华人租房", href: "/city/vancouver" },
      { label: "Burnaby 华人租房", href: "/area/burnaby" },
      { label: "Richmond BC 租房", href: "/area/richmond" },
      { label: "Surrey BC 租房", href: "/area/surrey" },
    ],
  },
  surrey: {
    metaTitle: "Surrey BC 租房｜素里公寓、独立屋房源",
    metaDescription: "查看 Surrey BC 素里当前公寓、联排屋、独立屋和分租房源，比较价格、房型与入住条件，并获得中文看房协助。",
    intro: "Surrey 地域范围较大，Surrey City Centre、Guildford、Newton、Fleetwood 和 South Surrey 等生活圈之间的通勤方式与房型差异明显。靠近 Expo Line 的公寓和远离轨道交通的家庭住房不能只按城市名比较。本页帮助租客结合预算、交通和入住条件筛选当前房源。",
    sections: [
      {
        title: "Surrey 不同区域怎么选",
        paragraphs: [
          "Surrey Central、Gateway 和 King George 一带可连接 Expo Line，适合需要前往大温其他城市的租客；Guildford、Newton、Fleetwood 和 South Surrey 则更需要结合公交、汽车和具体目的地判断。看房前应测试工作日高峰路线，并确认停车条件。",
        ],
      },
      {
        title: "公寓、联排和地下室套房",
        paragraphs: [
          "公寓和联排屋要确认物业规则、车位、储物和搬入安排；独立屋分租或地下室套房要确认独立出入、厨房卫浴、供暖、隔音及水电网分摊。房间数量相同，并不代表使用空间和费用结构相同。",
        ],
      },
      {
        title: "签约前需要核实什么",
        paragraphs: [
          "确认准确地址、出租方身份、可入住日期、租期、押金和每月费用，并要求书面租约。远程租房时不要仅凭照片付款，应通过实时视频或可信代理核实房屋；页面显示的可用状态也需要在预约前重新确认。",
        ],
      },
    ],
    relatedLinks: [
      { label: "温哥华华人租房", href: "/city/vancouver" },
      { label: "Burnaby 华人租房", href: "/area/burnaby" },
      { label: "Richmond BC 租房", href: "/area/richmond" },
      { label: "Coquitlam 租房", href: "/area/coquitlam" },
    ],
  },
  "north-york": {
    metaTitle: "North York 华人租房｜北约克公寓、一室一厅房源",
    metaDescription: "查看 North York 北约克当前公寓、一室一厅、独立屋和合租房源，比较租金、入住时间与核实状态，提供中文找房协助。",
    intro: "North York 范围较广，Yonge Street 地铁走廊、高层公寓区和远离地铁的住宅区，在通勤和生活方式上差异明显。找房时应先确定每天需要前往的学校或工作地点，再比较地铁、公交、停车和楼宇费用。本页汇总当前可租房源并提供中文筛选入口。",
    sections: [
      {
        title: "Yonge Street 地铁走廊怎么选",
        paragraphs: [
          "Finch、North York Centre 和 Sheppard–Yonge 一带可连接 TTC Line 1，Sheppard–Yonge 还可换乘 Line 4。靠近车站的公寓适合重视通勤的租客，但应核实实际步行距离、楼宇设施费、车位和储物；远离地铁的房源则要检查公交接驳。",
        ],
      },
      {
        title: "一室一厅、公寓和地下室房源",
        paragraphs: [
          "一室一厅可能是共管公寓、出租公寓或独立屋内的套房，申请条件和费用结构不同。应确认是否独立出入、洗衣和厨房是否共享、水电网是否包含，以及暖气和空调控制方式，不要只依据卧室数量判断。",
        ],
      },
      {
        title: "申请和学区核实",
        paragraphs: [
          "房东或物业可能要求信用、收入、工作或资金材料；新移民和留学生可提前准备身份证明、录取或雇佣文件及担保方案。学校需求必须按完整地址向对应教育机构确认，付款前还要核对出租方、房屋和租约。",
        ],
      },
    ],
    relatedLinks: [
      { label: "多伦多华人租房", href: "/city/toronto" },
      { label: "Markham 华人租房", href: "/area/markham" },
      { label: "Richmond Hill 租房", href: "/area/richmond-hill" },
      { label: "Mississauga 租房", href: "/area/mississauga" },
    ],
  },
  markham: {
    metaTitle: "Markham 华人租房｜万锦公寓、独立屋房源",
    metaDescription: "查看 Markham 万锦当前公寓、联排屋、独立屋和分租房源，按预算与入住时间筛选，并获得中文房源确认和看房协助。",
    intro: "Markham 的租房选择分布在 Highway 7、Downtown Markham、Unionville、Thornhill 和其他住宅区。不同位置在 YRT/Viva、GO Transit、开车通勤和生活设施方面差异明显。本页把当前房源的价格、房型和核实状态集中展示，方便租客先缩小范围。",
    sections: [
      {
        title: "万锦不同生活圈怎么比较",
        paragraphs: [
          "Downtown Markham 和 Highway 7 沿线常见公寓及商业设施，Unionville、Thornhill 和更深入住宅区可能有联排、独立屋或分租选择。选择时应根据工作或学校方向测试实际路线，并核实门牌所在的行政和学校边界。",
        ],
      },
      {
        title: "YRT、Viva、GO 与开车通勤",
        paragraphs: [
          "YRT 和 Viva 连接 Markham、Richmond Hill 及多伦多交通网络，部分租客也会结合 GO Transit。公共交通是否方便取决于房源到站点的距离、换乘和班次；开车租客则要比较高峰时间、车位数量及冬季停车规则。",
        ],
      },
      {
        title: "家庭和新移民申请重点",
        paragraphs: [
          "家庭租客要确认卧室、学校、停车、宠物和长期租约；新移民或留学生可准备资金、工作或录取材料及担保方案。任何情况下都应在付款前核实出租方身份、完整地址、房屋状态和书面租约。",
        ],
      },
    ],
    relatedLinks: [
      { label: "多伦多华人租房", href: "/city/toronto" },
      { label: "North York 华人租房", href: "/area/north-york" },
      { label: "Richmond Hill 租房", href: "/area/richmond-hill" },
      { label: "Mississauga 租房", href: "/area/mississauga" },
    ],
  },
  "richmond-hill": {
    metaTitle: "Richmond Hill 租房｜列治文山公寓、独立屋房源",
    metaDescription: "查看 Richmond Hill 列治文山当前公寓、联排屋、独立屋和分租房源，比较价格、房型与最后核实时间，提供中文协助。",
    intro: "Richmond Hill 的公寓、联排屋、独立屋和分租房源分布在 Yonge Street、Highway 7 与多个住宅区。租客需要在公共交通、开车通勤、空间和预算之间权衡。本页展示当前可租记录，并帮助用户比较房型、价格和最后核实状态。",
    sections: [
      {
        title: "Yonge Street 与住宅区怎么选",
        paragraphs: [
          "Yonge Street 和 Highway 7 周边更容易连接商业设施及区域公共交通；远离主要走廊的住宅区可能提供更多家庭型房屋，但更依赖公交接驳或汽车。应使用准确地址测试通勤，而不是只按 Richmond Hill 城市名判断。",
        ],
      },
      {
        title: "Viva、YRT 与 GO 通勤",
        paragraphs: [
          "Viva 和 YRT 连接 Richmond Hill、Markham 及多伦多交通网络，部分路线可衔接 GO Transit。看房前应核实最近站点、换乘次数、晚间班次和冬季步行条件；开车租客还要确认固定车位及访客停车。",
        ],
      },
      {
        title: "房屋费用和学校核实",
        paragraphs: [
          "公寓要确认车位、储物、物业规定和额外费用；独立屋、地下室或分租房要确认水电网、供暖、洗衣和公共区域。学校归属应按完整门牌核实，押金和租金则只应在出租方与书面租约确认后支付。",
        ],
      },
    ],
    relatedLinks: [
      { label: "多伦多华人租房", href: "/city/toronto" },
      { label: "North York 华人租房", href: "/area/north-york" },
      { label: "Markham 华人租房", href: "/area/markham" },
      { label: "Mississauga 租房", href: "/area/mississauga" },
    ],
  },
  mississauga: {
    metaTitle: "Mississauga 租房｜密西沙加公寓、整租房源",
    metaDescription: "查看 Mississauga 密西沙加当前公寓、联排屋、独立屋和整租房源，比较租金、房型与入住条件，并获得中文看房协助。",
    intro: "Mississauga 范围较大，City Centre、Cooksville、Port Credit、Erin Mills 等生活圈在通勤、房型和日常设施方面差异明显。租客应先确定前往多伦多、机场或本地工作地点的路线，再比较 MiWay、GO Transit、停车和租约条件。本页集中展示当前房源及核实状态。",
    sections: [
      {
        title: "City Centre、Cooksville 与 Port Credit",
        paragraphs: [
          "City Centre 和 Square One 周边常见高层公寓，Cooksville 与 Port Credit 可结合 GO Transit 和本地公交考虑，Erin Mills 等住宅区则可能出现联排或独立屋。每个区域内部跨度仍然较大，必须用完整地址测试实际通勤和生活距离。",
        ],
      },
      {
        title: "MiWay、GO 与开车通勤",
        paragraphs: [
          "MiWay 覆盖密西沙加本地出行，部分租客会通过 GO Transit 前往多伦多或其他城市。看房前要确认最近站点、换乘和班次，并为施工或线路调整预留时间；开车租客则应核实车位、访客停车和高速公路高峰通勤。",
        ],
      },
      {
        title: "公寓和家庭住房的申请重点",
        paragraphs: [
          "公寓要确认搬入预约、物业规则、车位、储物和水电费用；联排或独立屋要确认维护、供暖、庭院和公共设施责任。签约前核对出租方、准确地址、租期、押金与费用，并在预约前再次确认房源仍然可租。",
        ],
      },
    ],
    relatedLinks: [
      { label: "多伦多华人租房", href: "/city/toronto" },
      { label: "North York 华人租房", href: "/area/north-york" },
      { label: "Markham 华人租房", href: "/area/markham" },
      { label: "Richmond Hill 租房", href: "/area/richmond-hill" },
    ],
  },
}

export const schoolGuides: Record<string, LandingGuide> = {
  usc: {
    metaTitle: "USC 附近公寓出租｜南加大学生中文租房指南",
    metaDescription: "查看 USC 附近当前可租公寓、合租和整租房源，比较 University Park、Koreatown 与 Downtown LA 的通勤、租约和申请要求。",
    intro: "USC 附近租房不能只按离校园的直线距离判断。学生还要比较步行路线、校车或公共交通、晚间回程、家具、停车、租期和室友安排。本页集中展示与 USC、University Park、Koreatown 和 Downtown LA 相关的当前房源，并提供中文筛选和房源状态核实入口。",
    sections: [
      {
        title: "USC 周边常见居住选择",
        paragraphs: [
          "University Park 靠近校园，适合希望减少通勤时间的学生，但同一街区不同位置的步行体验、楼况和管理方式可能不同。Koreatown 房型和生活选择较多，通常需要结合地铁、公交或开车路线判断。Downtown LA 的公寓设施可能更集中，签约前则要确认到校交通、停车和楼宇额外费用。",
          "West Adams 及周边也可能出现学生合租或独立屋房间。选择时要确认房间是否独立签约、公共区域由谁管理、室友更换规则以及整套租约中每个人承担的责任。",
        ],
      },
      {
        title: "通勤和安全如何核实",
        paragraphs: [
          "看地图时应分别检查白天上课、晚间回家和周末购物路线。靠近车站或校园并不等于所有时段都适合步行，建议查看学校公布的交通与安全资源，并在条件允许时亲自走一次常用路线。任何房源都不应仅凭“安全社区”这样的宣传词作决定。",
          "如果依赖公共交通，应确认车站位置、换乘次数和末班时间；如果开车，则要确认固定停车位、访客停车和每月停车费用。带家具房源还需核对床、桌椅和厨房设备是否包含在租约附件中。",
        ],
      },
      {
        title: "国际学生常见申请材料",
        paragraphs: [
          "不同房东和物业公司的标准不同，常见材料包括身份证明、录取或在读证明、资金证明、收入材料、信用记录或担保人信息。没有美国信用记录时，可以提前询问是否接受担保人、额外资金证明或其他替代方案，不要等到提交申请后才准备。",
          "申请费、订金和押金的性质不同。付款前应拿到准确地址、费用说明和书面条款，确认收款主体与合同出租方一致。远程签约时可要求实时视频看房，并保存合同、付款凭证和沟通记录。",
        ],
      },
      {
        title: "租期和室友安排",
        paragraphs: [
          "学生房源常受开学季影响，热门入住月份应提前准备预算和材料。签约时要确认完整租期、续租、转租、提前退租及室友退出的处理方式。不能只根据“可短租”或“可转租”的口头说明做决定。",
          "本页显示的数量和价格来自当前可用房源记录，价格不代表整个 USC 周边市场的官方平均值。最后核实时间只在房源确实留下核实记录时展示；尚未核实的房源会明确标注，预约前需要再次确认。",
        ],
      },
    ],
    relatedLinks: [
      { label: "洛杉矶华人租房", href: "/city/los-angeles" },
      { label: "Irvine 华人租房", href: "/area/irvine" },
      { label: "San Gabriel 华人租房", href: "/area/san-gabriel" },
      { label: "UCLA 附近租房", href: "/schools/ucla" },
    ],
  },
}
