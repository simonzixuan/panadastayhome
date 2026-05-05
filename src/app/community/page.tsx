const guidelines = [
  {
    title: "裸露或色情内容",
    content:
      "House Finder 的目的不是为了宣传色情内容或露骨内容。如果您的内容有此类内容，即使是关于您自己的图片，也请勿在 House Finder 上发布。另外请注意，我们与执法部门密切合作，会举报任何关于剥削儿童的内容。",
  },
  {
    title: "有危害性或危险性的内容",
    content:
      "切勿发布鼓动他人（特别是儿童）进行危险行为（可能会导致他们严重受伤）的视频、图片、文字等。对于展现此类有害或危险行为的内容，我们可能会根据内容的严重程度将其移除。",
  },
  {
    title: "宣扬仇恨的内容",
    content:
      "我们鼓励言论自由，但内容不得因种族或族裔、宗教信仰、残障、性别、年龄、国籍、退伍军人身份或性取向/性别认同等原因，宣扬或纵容针对个人或群体的暴力，内容的主要目的也不得是围绕上述这些核心特征煽动仇恨。如果内容的主要目的是攻击受保护群体，则该内容即属不当。",
  },
  {
    title: "暴力或写实性内容",
    content:
      "请勿为了吓人或引起轰动而发布暴力或血腥内容，也不要无端发布这类内容。如果要在新闻或纪实性情境中发布这类写实内容，请务必提供充足的信息，帮助用户了解内容中即将出现什么内容。请勿怂恿他人实施特定的暴力行为。",
  },
  {
    title: "骚扰和网络欺凌",
    content:
      "在 House Finder 上发布骚扰性内容和评论是不当的做法。如果骚扰演变成了恶意攻击，内容和评论可能会被举报并移除。",
  },
  {
    title: "垃圾内容、误导性信息和欺骗手段",
    content:
      "每个人都讨厌垃圾内容。请不要为了增加曝光而采用误导性的说明、标签或标题。发布大量漫无目的、令人讨厌或重复的内容（包括评论和私信）是不当的做法。",
  },
  {
    title: "威胁",
    content:
      "恃强凌弱、跟踪、威胁、骚扰、胁迫、侵犯隐私、泄露他人的个人信息以及煽动他人进行暴力行为或违反使用条款等行为将受到严肃处理。若发现任何人有以上行为，我们可能会永远禁止其登录 House Finder。",
  },
  {
    title: "版权",
    content:
      "尊重版权。仅上传您制作的或您有权使用的图片和内容。请勿上传不是由您制作的内容，也不要未经必要的授权就在您发布的内容中使用他人拥有版权的内容。",
  },
  {
    title: "隐私权",
    content:
      "如果有人未经您许可擅自发布了您的个人信息或上传了您的图片，您可以根据我们的隐私权准则请求移除此类内容。",
  },
  {
    title: "冒充别人",
    content:
      "为了冒充其他机构或个人而创建的帐号可能会被移除。",
  },
  {
    title: "儿童安全",
    content:
      "我们保护 House Finder 生态系统中的未成年人。同时请注意，我们与执法部门有着密切的合作，任何危害儿童的内容或行为都会遭到举报。",
  },
]

export default function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">社群指南</h1>
      <p className="text-gray-500 mb-8 text-sm">最后更新：2026年5月</p>

      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <p className="text-gray-700 leading-relaxed">
          使用 <strong>House Finder</strong> 时，您会置身于一个成员遍布世界各地的大家庭。House Finder 上每个精彩的社区功能都是以一定程度的信任为基础的。数以百万计的用户都尊重这份信任，我们希望您也承担起相应的责任。为确保每个人都能获得有趣又愉快的 House Finder 使用体验，最好的方式就是遵循以下这些准则。
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          您可能不喜欢在 House Finder 上看到某些内容。如果您认为某些内容是不当内容，请使用举报功能将其提交给我们的员工进行审核。我们的员工全年无休，会仔细审核被举报的内容，判断它们是否违反了我们的社区准则。
        </p>
      </div>

      <div className="space-y-6">
        {guidelines.map((item, i) => (
          <div key={i} className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h2>
            <p className="text-gray-600 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6 text-sm text-gray-500 leading-relaxed">
        如果 House Finder 用户在平台内外的行为伤害了我们的用户、社区、员工或生态系统，我们可能会综合考虑多种因素，包括但不限于其行为的恶劣程度以及是否属于习惯性有害行为，来采取相应措施。对于这类行为，我们轻则会禁言，重则会终止其帐号。
      </div>
    </div>
  )
}
