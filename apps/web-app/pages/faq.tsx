import Head from "next/head";
import FaqContent from '../mdx/faq.mdx';
import BaseTemplate from '../templates/Base';

export default function Page() {
  return (
    <BaseTemplate>
      <Head>
        <title>FAQ</title>
      </Head>
      <div className="flex flex-col border border-black p-5 bg-[#EEEEF0] gap-5 w-full h-full">
        <div className="flex gap-5 flex-col p-5 md:p-10 bg-white rounded-[16px]">
          <div className="prose max-w-none">
            <div className="max-w-4xl mx-auto">
              <FaqContent />
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
}
 