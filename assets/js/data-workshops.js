/* ==========================================================================
   DIHUOLAB · Workshop manual data
   --------------------------------------------------------------------------
   Each entry drives one card on workshops/index.html and en/workshops/index.html.
   The manual page itself lives at workshops/<slug>.html (and en/workshops/...).

   Add a workshop:
   1. Copy workshops/template.html to workshops/<slug>.html and fill it in.
   2. Copy en/workshops/template.html to en/workshops/<slug>.html and translate.
   3. Add an entry below with status: "published".
   4. Update sitemap.xml.

   Keep status: "draft" for work in progress. Draft entries are not rendered.
   ========================================================================== */

window.DIHUO_WORKSHOPS = {
  workshops: [
    {
      slug: "drv8825-stepmotor",
      status: "published",
      updated: "2026-11-17",
      zh: {
        title: "让电机转起来",
        summary:
          "用 ESP32-S2、DRV8825 和 42 步进电机，从找线圈、接线、定电流到烧录程序，搭出运动控制系统的最小原型。",
        duration: "约 90 分钟",
        people: "两人一组",
        level: "零基础",
        tags: ["ESP32", "DRV8825", "步进电机", "Arduino"]
      },
      en: {
        title: "Make the Motor Turn",
        summary:
          "Use an ESP32-S2, DRV8825 and a 42 stepper motor to find coils, wire up, set current and flash a program — the smallest working motion-control prototype.",
        duration: "About 90 min",
        people: "Pairs",
        level: "Beginner",
        tags: ["ESP32", "DRV8825", "Stepper", "Arduino"]
      }
    }
  ]
};
